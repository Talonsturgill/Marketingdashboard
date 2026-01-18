"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionService = void 0;
const client_1 = require("@notionhq/client");
const axios_1 = require("axios");
class NotionService {
    constructor() {
        this.notion = null;
        const apiKey = process.env.NOTION_API_KEY;
        this.eventsDbId = process.env.NOTION_EVENTS_DB_ID || '';
        this.contentDbId = process.env.NOTION_CONTENT_DB_ID || '';
        this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || '';
        if (apiKey) {
            this.notion = new client_1.Client({ auth: apiKey });
        }
        else if (!this.n8nWebhookUrl) {
            console.warn('Neither NOTION_API_KEY nor N8N_WEBHOOK_URL is set. Using mock data.');
        }
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            // Strategy 1: n8n Webhook
            if (this.n8nWebhookUrl) {
                try {
                    const response = yield axios_1.default.get(this.n8nWebhookUrl);
                    return response.data.events || [];
                }
                catch (error) {
                    console.error('Error fetching from n8n:', error);
                    return [];
                }
            }
            // Strategy 2: Direct Notion API
            if (this.notion && this.eventsDbId) {
                try {
                    const response = yield this.notion.databases.query({
                        database_id: this.eventsDbId,
                        sorts: [{ property: 'Date', direction: 'ascending' }],
                    });
                    return response.results.map((page) => this.mapNotionPageToEvent(page));
                }
                catch (error) {
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
        });
    }
    getContentPipeline() {
        return __awaiter(this, void 0, void 0, function* () {
            let contentItems = [];
            // Strategy 1: n8n Webhook
            if (this.n8nWebhookUrl) {
                try {
                    const response = yield axios_1.default.get(this.n8nWebhookUrl);
                    // Assume response.data.content is the array of items
                    if (Array.isArray(response.data.content)) {
                        contentItems = response.data.content;
                    }
                    else if (response.data.content && Array.isArray(response.data.content.results)) {
                        // Handle potential Notion API raw dump structure where it might be under results
                        contentItems = response.data.content.results.map((page) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                            // precise mapping if it's raw notion blocks
                            const props = page.properties || {};
                            return {
                                id: page.id,
                                title: ((_c = (_b = (_a = props.Name) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.plain_text) || 'Untitled',
                                platform: ((_e = (_d = props.Platform) === null || _d === void 0 ? void 0 : _d.select) === null || _e === void 0 ? void 0 : _e.name) || 'unknown',
                                type: ((_g = (_f = props.Type) === null || _f === void 0 ? void 0 : _f.select) === null || _g === void 0 ? void 0 : _g.name) || 'Post',
                                status: ((_j = (_h = props.Status) === null || _h === void 0 ? void 0 : _h.status) === null || _j === void 0 ? void 0 : _j.name) || 'draft',
                                date: ((_l = (_k = props.Date) === null || _k === void 0 ? void 0 : _k.date) === null || _l === void 0 ? void 0 : _l.start) || new Date().toISOString()
                            };
                        });
                    }
                    else {
                        // If it's already simplified by n8n (which seems to be the case based on grep)
                        // The grep showed keys like "platform", "type" directly on the object.
                        // So likely response.data.content is [ { platform: "...", ... }, ... ]
                        contentItems = response.data.content || [];
                    }
                }
                catch (error) {
                    console.error('Error fetching content from n8n:', error);
                    // Fallback to empty or mock if critical
                }
            }
            // Strategy 2: Direct Notion API (Fallback/Alternative)
            // Only run if n8n failed or not configured and we have notion creds
            if (contentItems.length === 0 && this.notion && this.contentDbId) {
                try {
                    const response = yield this.notion.databases.query({
                        database_id: this.contentDbId,
                        sorts: [{ property: 'Date', direction: 'descending' }],
                        page_size: 50
                    });
                    contentItems = response.results.map((page) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                        const props = page.properties;
                        return {
                            id: page.id,
                            title: ((_c = (_b = (_a = props.Name) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.plain_text) || 'Untitled',
                            platform: ((_e = (_d = props.Platform) === null || _d === void 0 ? void 0 : _d.select) === null || _e === void 0 ? void 0 : _e.name) || 'unknown',
                            type: ((_g = (_f = props.Type) === null || _f === void 0 ? void 0 : _f.select) === null || _g === void 0 ? void 0 : _g.name) || 'Post',
                            status: ((_j = (_h = props.Status) === null || _h === void 0 ? void 0 : _h.status) === null || _j === void 0 ? void 0 : _j.name) || 'draft',
                            date: ((_l = (_k = props.Date) === null || _k === void 0 ? void 0 : _k.date) === null || _l === void 0 ? void 0 : _l.start) || new Date().toISOString()
                        };
                    });
                }
                catch (error) {
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
                recentActivity: []
            };
            const normalizePlatform = (p) => {
                const lower = p.toLowerCase();
                if (lower.includes('linkedin'))
                    return 'linkedin';
                if (lower.includes('instagram'))
                    return 'instagram';
                if (lower.includes('twitter') || lower.includes(' x '))
                    return 'twitter';
                if (lower.includes('tiktok'))
                    return 'tiktok';
                if (lower.includes('email'))
                    return 'email';
                if (lower.includes('blog'))
                    return 'blog';
                return 'unknown';
            };
            const normalizeStatus = (s) => {
                const lower = s.toLowerCase();
                if (lower === 'published' || lower === 'done' || lower === 'complete')
                    return 'published';
                if (lower === 'approved' || lower === 'ready')
                    return 'approved';
                return 'draft';
            };
            contentItems.forEach(item => {
                const status = normalizeStatus(item.status || 'draft');
                const platform = normalizePlatform(item.platform || 'unknown');
                const type = item.type || 'Post';
                const title = item.title || 'Untitled';
                const date = item.date || new Date().toISOString();
                if (status === 'published')
                    stats.published++;
                else if (status === 'approved')
                    stats.approved++;
                else
                    stats.draft++;
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
        });
    }
    mapNotionPageToEvent(page) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const props = page.properties;
        const startDate = ((_b = (_a = props.Date) === null || _a === void 0 ? void 0 : _a.date) === null || _b === void 0 ? void 0 : _b.start) || new Date().toISOString();
        const endDate = ((_d = (_c = props.Date) === null || _c === void 0 ? void 0 : _c.date) === null || _d === void 0 ? void 0 : _d.end) || startDate;
        return {
            id: page.id,
            name: ((_g = (_f = (_e = props.Name) === null || _e === void 0 ? void 0 : _e.title) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.plain_text) || 'Untitled Event',
            type: ((_k = (_j = (_h = props.Type) === null || _h === void 0 ? void 0 : _h.select) === null || _j === void 0 ? void 0 : _j.name) === null || _k === void 0 ? void 0 : _k.toLowerCase()) || 'standard',
            status: ((_o = (_m = (_l = props.Status) === null || _l === void 0 ? void 0 : _l.status) === null || _m === void 0 ? void 0 : _m.name) === null || _o === void 0 ? void 0 : _o.toLowerCase()) || 'upcoming',
            startDate,
            eventDate: startDate,
            endDate,
            goals: {
                linkedin: ((_p = props.LinkedInGoal) === null || _p === void 0 ? void 0 : _p.number) || 0,
                instagram: ((_q = props.InstagramGoal) === null || _q === void 0 ? void 0 : _q.number) || 0,
                twitter: ((_r = props.TwitterGoal) === null || _r === void 0 ? void 0 : _r.number) || 0,
                tiktok: ((_s = props.TikTokGoal) === null || _s === void 0 ? void 0 : _s.number) || 0,
                youtube: ((_t = props.YoutubeGoal) === null || _t === void 0 ? void 0 : _t.number) || 0
            }
        };
    }
}
exports.NotionService = NotionService;
//# sourceMappingURL=notionService.js.map