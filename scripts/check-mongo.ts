import { MongoClient } from 'mongodb';

async function check() {
    const url = process.env.MONGODB_URL || "mongodb://localhost:27017";
    const dbName = "sinapi";
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        for (const coll of collections) {
            const count = await db.collection(coll.name).countDocuments();
            console.log(`Collection ${coll.name}: ${count} documents`);
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.close();
    }
}

check();
