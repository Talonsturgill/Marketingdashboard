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
exports.BlobService = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const CONTAINER_NAME = "marketing-data";
const EVENTS_BLOB = "events.json";
class BlobService {
    constructor() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("AZURE_STORAGE_CONNECTION_STRING is not defined");
        }
        this.blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME);
    }
    ensureContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.containerClient.createIfNotExists();
        });
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureContainer();
            const blobClient = this.containerClient.getBlockBlobClient(EVENTS_BLOB);
            if (!(yield blobClient.exists())) {
                return [];
            }
            const downloadBlockBlobResponse = yield blobClient.download(0);
            const downloaded = yield this.streamToString(downloadBlockBlobResponse.readableStreamBody);
            return JSON.parse(downloaded);
        });
    }
    saveEvents(events) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureContainer();
            const blobClient = this.containerClient.getBlockBlobClient(EVENTS_BLOB);
            const content = JSON.stringify(events, null, 2);
            yield blobClient.upload(content, content.length);
        });
    }
    streamToString(readableStream) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const chunks = [];
                readableStream.on("data", (data) => {
                    chunks.push(data.toString());
                });
                readableStream.on("end", () => {
                    resolve(chunks.join(""));
                });
                readableStream.on("error", reject);
            });
        });
    }
}
exports.BlobService = BlobService;
//# sourceMappingURL=blobService.js.map