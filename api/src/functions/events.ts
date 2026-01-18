import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlobService } from "../services/blobService";

const blobService = new BlobService();

export async function getEvents(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const events = await blobService.getEvents();
        return {
            status: 200,
            jsonBody: events
        };
    } catch (error: any) {
        context.error('Error fetching events:', error);
        return {
            status: 500,
            body: `Error fetching events: ${error.message}`
        };
    }
}

export async function createEvent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const event = await request.json() as any; // Type strictly in real app
        if (!event || !event.name) {
            return { status: 400, body: "Invalid event data" };
        }

        const events = await blobService.getEvents();
        events.push(event);
        await blobService.saveEvents(events);

        return { status: 201, jsonBody: event };
    } catch (error: any) {
        return { status: 500, body: error.message };
    }
};

app.get('getEvents', {
    route: 'events',
    handler: getEvents
});

app.post('createEvent', {
    route: 'events',
    handler: createEvent
});
