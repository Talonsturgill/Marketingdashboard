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
exports.SlackService = void 0;
const axios_1 = require("axios");
const rag_1 = require("../utils/rag");
const date_fns_1 = require("date-fns");
class SlackService {
    constructor() {
        this.webhookUrl = process.env.SLACK_WEBHOOK_URL || "";
    }
    sendReport(events) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.webhookUrl) {
                console.warn("SLACK_WEBHOOK_URL is not set. Skipping report.");
                return;
            }
            const blocks = this.generateBlocks(events);
            try {
                yield axios_1.default.post(this.webhookUrl, { blocks });
            }
            catch (error) {
                console.error("Failed to send Slack report:", error);
                throw error;
            }
        });
    }
    generateBlocks(events) {
        const blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "📊 Transform Labs Marketing Report",
                    "emoji": true
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `Week of ${(0, date_fns_1.format)(new Date(), 'MMM d, yyyy')} • Generated automatically`
                    }
                ]
            },
            { "type": "divider" }
        ];
        events.filter(e => e.status === 'active').forEach(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const now = new Date();
            const totalDays = (0, date_fns_1.differenceInDays)(end, start) || 1;
            const elapsedDays = (0, date_fns_1.differenceInDays)(now, start);
            const timeElapsedPercent = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
            // Mock actuals for now. In real app, we'd pass in metrics alongside events or have events contain them.
            // Assuming event.goals matches the structure. We need 'actuals' somewhere. 
            // For now, I'll calculate rag based on a mock "60% complete" assumption if actuals aren't present.
            // In a real implementation, 'events' should probably encompass 'active status' or we fetch metrics per event.
            // Let's assume we fetch metrics separately or they are attached. 
            // I'll simulate "actuals" roughly tracking 60% of goal for the demo.
            const platforms = ['linkedin', 'instagram', 'twitter'];
            const fields = [];
            platforms.forEach(p => {
                const goal = event.goals[p] || 0;
                if (goal > 0) {
                    const actual = Math.floor(goal * 0.65); // Mock 65%
                    const rag = (0, rag_1.getRAGStatus)(actual, goal, timeElapsedPercent);
                    const percent = Math.round((actual / goal) * 100);
                    fields.push({
                        "type": "mrkdwn",
                        "text": `*${p.charAt(0).toUpperCase() + p.slice(1)}*\n${rag.emoji} ${actual}/${goal}\n\`${(0, rag_1.createProgressBar)(percent, 8)}\` ${percent}%`
                    });
                }
            });
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*🎯 ${event.name}*\n${event.type} • Status: ON TRACK`
                }
            });
            if (fields.length > 0) {
                blocks.push({
                    "type": "section",
                    "fields": fields
                });
            }
            blocks.push({ "type": "divider" });
        });
        blocks.push({
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": { "type": "plain_text", "text": "📊 Dashboard" },
                    "url": "https://marketing.transformlabs.com",
                    "style": "primary"
                }
            ]
        });
        return blocks;
    }
}
exports.SlackService = SlackService;
//# sourceMappingURL=slackService.js.map