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
exports.weeklyReport = weeklyReport;
const functions_1 = require("@azure/functions");
const blobService_1 = require("../services/blobService");
const slackService_1 = require("../services/slackService");
function weeklyReport(myTimer, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('Weekly report timer triggered.');
        const blobService = new blobService_1.BlobService();
        const slackService = new slackService_1.SlackService();
        try {
            const events = yield blobService.getEvents();
            const activeEvents = events.filter(e => e.status === 'active');
            if (activeEvents.length > 0) {
                yield slackService.sendReport(activeEvents);
                context.log(`Sent report for ${activeEvents.length} active events.`);
            }
            else {
                context.log("No active events to report.");
            }
        }
        catch (err) {
            context.error("Error sending weekly report:", err);
        }
    });
}
functions_1.app.timer('weeklyReport', {
    schedule: '0 0 8 * * 1', // Every Monday at 8am
    handler: weeklyReport
});
//# sourceMappingURL=weeklyReport.js.map