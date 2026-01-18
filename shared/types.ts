export type EventType = 'flagship' | 'standard' | 'community' | 'virtual';
export type EventStatus = 'upcoming' | 'active' | 'completed';

export interface SocialGoals {
    linkedin: number;
    instagram: number;
    twitter: number;
    tiktok: number;
    youtube: number;
}

export interface MarketingEvent {
    id: string;
    name: string;
    type: EventType;
    status: EventStatus;
    startDate: string; // ISO Date
    eventDate: string; // ISO Date
    endDate: string;   // ISO Date
    goals: SocialGoals;
    posts?: PostMetric[]; // Optional array of linked posts
}

export interface PostMetric {
    platform: 'linkedin' | 'instagram' | 'twitter';
    postId: string;
    timestamp: string;
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
}

export type ContentStatus = 'draft' | 'approved' | 'published' | 'scheduled';
export type ContentPlatform = 'linkedin' | 'instagram' | 'twitter' | 'tiktok' | 'email' | 'blog' | 'unknown';

export interface ContentItem {
    id: string;
    title: string;
    platform: ContentPlatform;
    type: string; // e.g., 'Post', 'Thread', 'Case Study'
    status: ContentStatus;
    date: string; // ISO string
    url?: string;
}

export interface DashboardStats {
    totalPosts: number;
    health: 'green' | 'yellow' | 'red';
    nextEventDays: number;
    pipeline: {
        draft: number;
        approved: number;
        published: number;
        recentActivity: ContentItem[];
        thisMonthCount: number;
        platformDistribution?: Record<string, number>;
    };
}
