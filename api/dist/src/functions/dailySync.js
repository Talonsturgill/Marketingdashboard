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
exports.dailySync = dailySync;
const functions_1 = require("@azure/functions");
const blobService_1 = require("../services/blobService");
const socialService_1 = require("../services/socialService");
function dailySync(myTimer, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('Timer function processed request.');
        const blobService = new blobService_1.BlobService();
        const socialService = new socialService_1.MockSocialService();
        try {
            const events = yield blobService.getEvents();
            // Logic: For each active event, fetch posts and update metrics
            // For now, just log
            context.log(`Found ${events.length} events to sync.`);
            // This is where we would call socialService.getPosts() and match them to events
        }
        catch (err) {
            context.error("Error in dailySync:", err);
        }
    });
}
functions_1.app.timer('dailySync', {
    schedule: '0 0 6 * * *', // Every day at 6am
    handler: dailySync
});
//# sourceMappingURL=dailySync.js.map