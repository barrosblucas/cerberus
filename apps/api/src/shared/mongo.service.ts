import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { MongoClient, Db } from "mongodb";

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
    private client!: MongoClient;
    private db!: Db;
    private readonly logger = new Logger(MongoService.name);

    async onModuleInit() {
        const url = process.env.MONGODB_URL || "mongodb://localhost:27017";
        const dbName = process.env.MONGODB_DB || "sinapi";

        try {
            this.client = await MongoClient.connect(url);
            this.db = this.client.db(dbName);
            this.logger.log(`Connected to MongoDB: ${dbName}`);
        } catch (err: any) {
            this.logger.error(`Failed to connect to MongoDB: ${err.message}`);
        }
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.close();
        }
    }

    getDb(): Db {
        return this.db;
    }

    getCollection(name: string) {
        if (!this.db) {
            throw new Error("MongoDB not connected");
        }
        return this.db.collection(name);
    }
}
