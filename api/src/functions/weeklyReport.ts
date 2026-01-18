import { app, InvocationContext, Timer } from "@azure/functions";
import { BlobService } from "../services/blobService";
import { SlackService } from "../services/slackService";

export async function weeklyReport(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Weekly report timer triggered.');

    const blobService = new BlobService();
    const slackService = new SlackService();

    try {
        const events = await blobService.getEvents();
        const activeEvents = events.filter(e => e.status === 'active');

        if (activeEvents.length > 0) {
            await slackService.sendReport(activeEvents);
            context.log(`Sent report for ${activeEvents.length} active events.`);
        } else {
            context.log("No active events to report.");
        }
    } catch (err) {
        context.error("Error sending weekly report:", err);
    }
}

app.timer('weeklyReport', {
    schedule: '0 0 8 * * 1', // Every Monday at 8am
    handler: weeklyReport
});
