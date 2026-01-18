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
exports.getEvents = getEvents;
exports.createEvent = createEvent;
const functions_1 = require("@azure/functions");
const blobService_1 = require("../services/blobService");
const blobService = new blobService_1.BlobService();
function getEvents(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`Http function processed request for url "${request.url}"`);
        try {
            const events = yield blobService.getEvents();
            return {
                status: 200,
                jsonBody: events
            };
        }
        catch (error) {
            context.error('Error fetching events:', error);
            return {
                status: 500,
                body: `Error fetching events: ${error.message}`
            };
        }
    });
}
function createEvent(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield request.json(); // Type strictly in real app
            if (!event || !event.name) {
                return { status: 400, body: "Invalid event data" };
            }
            const events = yield blobService.getEvents();
            events.push(event);
            yield blobService.saveEvents(events);
            return { status: 201, jsonBody: event };
        }
        catch (error) {
            return { status: 500, body: error.message };
        }
    });
}
;
functions_1.app.get('getEvents', {
    route: 'events',
    handler: getEvents
});
functions_1.app.post('createEvent', {
    route: 'events',
    handler: createEvent
});
//# sourceMappingURL=events.js.map