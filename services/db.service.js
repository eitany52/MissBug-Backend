import { MongoClient } from "mongodb"
import { loggerService } from "./logger.service.js"

const url = process.env.MONGO_URL
const dbName = process.env.DB_NAME
let db = null

export const dbService = {
    getCollection
}

async function getCollection(collectionName) {
    try {
        await _connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (error) {
        loggerService.error("Failed to get Mongo collection", error)
        throw error
    }
}

async function _connect() {
    try {
        if (db) return
        const client = await MongoClient.connect(url)
        db = client.db(dbName)
    } catch (error) {
        loggerService.error("Failed to get Mongo collection", error)
        throw error
    }
}