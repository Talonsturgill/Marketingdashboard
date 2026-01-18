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
