import { app, InvocationContext, Timer } from "@azure/functions";
import { BlobService } from "../services/blobService";
import { MockSocialService } from "../services/socialService";

export async function dailySync(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');

    const blobService = new BlobService();
    const socialService = new MockSocialService();

    try {
        const events = await blobService.getEvents();
        // Logic: For each active event, fetch posts and update metrics
        // For now, just log
        context.log(`Found ${events.length} events to sync.`);

        // This is where we would call socialService.getPosts() and match them to events

    } catch (err) {
        context.error("Error in dailySync:", err);
    }
}

app.timer('dailySync', {
    schedule: '0 0 6 * * *', // Every day at 6am
    handler: dailySync
});
