import { PostMetric } from "../types";

export interface ISocialService {
    getPosts(platform: 'linkedin' | 'instagram' | 'twitter', query: string, startDate: Date, endDate: Date): Promise<PostMetric[]>;
}

export class MockSocialService implements ISocialService {
    async getPosts(platform: 'linkedin' | 'instagram' | 'twitter', query: string, startDate: Date, endDate: Date): Promise<PostMetric[]> {
        // Return dummy data for now
        console.log(`Mock fetching ${platform} posts for ${query} from ${startDate} to ${endDate}`);

        return [
            {
                platform,
                postId: 'mock-1',
                timestamp: new Date().toISOString(),
                impressions: 1200,
                likes: 45,
                comments: 5,
                shares: 2
            },
            {
                platform,
                postId: 'mock-2',
                timestamp: new Date().toISOString(),
                impressions: 800,
                likes: 20,
                comments: 1,
                shares: 0
            }
        ];
    }
}
