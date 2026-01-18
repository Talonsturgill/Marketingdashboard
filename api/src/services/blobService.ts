import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { MarketingEvent, PostMetric } from "../types";

const CONTAINER_NAME = "marketing-data";
const EVENTS_BLOB = "events.json";

export class BlobService {
    private blobServiceClient: BlobServiceClient;
    private containerClient: ContainerClient;

    constructor() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("AZURE_STORAGE_CONNECTION_STRING is not defined");
        }
        this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME);
    }

    private async ensureContainer() {
        await this.containerClient.createIfNotExists();
    }

    async getEvents(): Promise<MarketingEvent[]> {
        await this.ensureContainer();
        const blobClient = this.containerClient.getBlockBlobClient(EVENTS_BLOB);

        if (!await blobClient.exists()) {
            return [];
        }

        const downloadBlockBlobResponse = await blobClient.download(0);
        const downloaded = await this.streamToString(downloadBlockBlobResponse.readableStreamBody!);
        return JSON.parse(downloaded) as MarketingEvent[];
    }

    async saveEvents(events: MarketingEvent[]): Promise<void> {
        await this.ensureContainer();
        const blobClient = this.containerClient.getBlockBlobClient(EVENTS_BLOB);
        const content = JSON.stringify(events, null, 2);
        await blobClient.upload(content, content.length);
    }

    private async streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: string[] = [];
            readableStream.on("data", (data) => {
                chunks.push(data.toString());
            });
            readableStream.on("end", () => {
                resolve(chunks.join(""));
            });
            readableStream.on("error", reject);
        });
    }
}
