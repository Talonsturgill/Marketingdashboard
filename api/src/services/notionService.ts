import { Client } from '@notionhq/client';
import { MarketingEvent, PostMetric, EventStatus, EventType } from '../shared_types';
import axios from 'axios';

export class NotionService {
    private notion: Client | null = null;
    private eventsDbId: string;
    private contentDbId: string;
    private n8nWebhookUrl: string;

    constructor() {
        const apiKey = process.env.NOTION_API_KEY;
        this.eventsDbId = process.env.NOTION_EVENTS_DB_ID || '';
        this.contentDbId = process.env.NOTION_CONTENT_DB_ID || '';
        this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || '';

        if (apiKey) {
            this.notion = new Client({ auth: apiKey });
        } else if (!this.n8nWebhookUrl) {
            console.warn('Neither NOTION_API_KEY nor N8N_WEBHOOK_URL is set. Using mock data.');
        }
    }

    async getEvents(): Promise<MarketingEvent[]> {
        // Strategy 1: n8n Webhook
        if (this.n8nWebhookUrl) {
            try {
                const response = await axios.get(this.n8nWebhookUrl);
                return response.data.events || [];
            } catch (error) {
                console.error('Error fetching from n8n:', error);
                return [];
            }
        }

        // Strategy 2: Direct Notion API
        if (this.notion && this.eventsDbId) {
            try {
                const response = await (this.notion.databases as any).query({
                    database_id: this.eventsDbId,
                    sorts: [{ property: 'Date', direction: 'ascending' }],
                });
                return response.results.map((page: any) => this.mapNotionPageToEvent(page));
            } catch (error) {
                console.error('Error fetching events from Notion:', error);
                return [];
            }
        }

        // Strategy 3: Mock Data (Fallback)
        return [
            {
                id: 'mock-1',
                name: 'Product Launch (Mock)',
                type: 'flagship',
                status: 'active',
                startDate: new Date().toISOString(),
                eventDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 86400000 * 14).toISOString(),
                goals: { linkedin: 10, instagram: 5, twitter: 5, tiktok: 0, youtube: 0 },
                posts: []
            }
        ];
    }

    async getContentPipeline() {
        let contentItems: any[] = [];

        // Strategy 1: n8n Webhook
        if (this.n8nWebhookUrl) {
            try {
                const response = await axios.get(this.n8nWebhookUrl);
                // Assume response.data.content is the array of items
                if (Array.isArray(response.data.content)) {
                    contentItems = response.data.content;
                } else if (response.data.content && Array.isArray(response.data.content.results)) {
                    // Handle potential Notion API raw dump structure where it might be under results
                    contentItems = response.data.content.results.map((page: any) => {
                        // precise mapping if it's raw notion blocks
                        const props = page.properties || {};
                        return {
                            id: page.id,
                            title: props.Name?.title?.[0]?.plain_text || 'Untitled',
                            platform: props.Platform?.select?.name || 'unknown',
                            type: props.Type?.select?.name || 'Post',
                            status: props.Status?.status?.name || 'draft',
                            date: props.Date?.date?.start || new Date().toISOString()
                        };
                    });
                } else {
                    // If it's already simplified by n8n (which seems to be the case based on grep)
                    // The grep showed keys like "platform", "type" directly on the object.
                    // So likely response.data.content is [ { platform: "...", ... }, ... ]
                    contentItems = response.data.content || [];
                }
            } catch (error) {
                console.error('Error fetching content from n8n:', error);
                // Fallback to empty or mock if critical
            }
        }

        // Strategy 2: Direct Notion API (Fallback/Alternative)
        // Only run if n8n failed or not configured and we have notion creds
        if (contentItems.length === 0 && this.notion && this.contentDbId) {
            try {
                const response = await (this.notion.databases as any).query({
                    database_id: this.contentDbId,
                    sorts: [{ property: 'Date', direction: 'descending' }],
                    page_size: 50
                });

                contentItems = response.results.map((page: any) => {
                    const props = page.properties;
                    return {
                        id: page.id,
                        title: props.Name?.title?.[0]?.plain_text || 'Untitled',
                        platform: props.Platform?.select?.name || 'unknown',
                        type: props.Type?.select?.name || 'Post',
                        status: props.Status?.status?.name || 'draft',
                        date: props.Date?.date?.start || new Date().toISOString()
                    };
                });
            } catch (error) {
                console.error('Error fetching content from Notion:', error);
            }
        }

        // If still empty, use mock data
        if (contentItems.length === 0) {
            // Mock data fallback
            return {
                draft: 5,
                approved: 2,
                published: 12,
                recentActivity: [
                    { id: 'm1', title: '5 AI Trends Transforming Marketing', platform: 'linkedin', type: 'Article', status: 'published', date: new Date().toISOString() },
                    { id: 'm2', title: 'Behind the scenes at HQ', platform: 'instagram', type: 'Story', status: 'published', date: new Date(Date.now() - 86400000).toISOString() },
                    { id: 'm3', title: 'Q1 Product Launch Announcement', platform: 'twitter', type: 'Tweet', status: 'draft', date: new Date(Date.now() - 172800000).toISOString() }
                ]
            };
        }

        // Aggregate Stats
        const stats = {
            draft: 0,
            approved: 0,
            published: 0,
            recentActivity: [] as any[]
        };

        const normalizePlatform = (p: string): string => {
            const lower = p.toLowerCase();
            if (lower.includes('linkedin')) return 'linkedin';
            if (lower.includes('instagram')) return 'instagram';
            if (lower.includes('twitter') || lower.includes(' x ')) return 'twitter';
            if (lower.includes('tiktok')) return 'tiktok';
            if (lower.includes('email')) return 'email';
            if (lower.includes('blog')) return 'blog';
            return 'unknown';
        };

        const normalizeStatus = (s: string): string => {
            const lower = s.toLowerCase();
            if (lower === 'published' || lower === 'done' || lower === 'complete') return 'published';
            if (lower === 'approved' || lower === 'ready') return 'approved';
            return 'draft';
        };

        contentItems.forEach(item => {
            const status = normalizeStatus(item.status || 'draft');
            const platform = normalizePlatform(item.platform || 'unknown');
            const type = item.type || 'Post';
            const title = item.title || 'Untitled';
            const date = item.date || new Date().toISOString();

            if (status === 'published') stats.published++;
            else if (status === 'approved') stats.approved++;
            else stats.draft++;

            if (status === 'published') {
                stats.recentActivity.push({
                    id: item.id || Math.random().toString(36).substr(2, 9),
                    title,
                    platform,
                    type,
                    status: 'published',
                    date
                });
            }
        });

        // Sort by date descending
        stats.recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return stats;
    }

    private mapNotionPageToEvent(page: any): MarketingEvent {
        const props = page.properties;
        const startDate = props.Date?.date?.start || new Date().toISOString();
        const endDate = props.Date?.date?.end || startDate;

        return {
            id: page.id,
            name: props.Name?.title?.[0]?.plain_text || 'Untitled Event',
            type: (props.Type?.select?.name?.toLowerCase() as EventType) || 'standard',
            status: (props.Status?.status?.name?.toLowerCase() as EventStatus) || 'upcoming',
            startDate,
            eventDate: startDate,
            endDate,
            goals: {
                linkedin: props.LinkedInGoal?.number || 0,
                instagram: props.InstagramGoal?.number || 0,
                twitter: props.TwitterGoal?.number || 0,
                tiktok: props.TikTokGoal?.number || 0,
                youtube: props.YoutubeGoal?.number || 0
            }
        };
    }
}
