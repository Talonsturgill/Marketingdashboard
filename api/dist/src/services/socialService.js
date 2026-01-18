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
exports.MockSocialService = void 0;
class MockSocialService {
    getPosts(platform, query, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.MockSocialService = MockSocialService;
//# sourceMappingURL=socialService.js.map