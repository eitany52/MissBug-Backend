import { MongoClient } from "mongodb"
import { loggerService } from "./logger.service.js"

const url = "mongodb+srv://eitany52:Eitany11040050@cluster0.boqng.mongodb.net/"
const dbName = "BUG_DB"
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