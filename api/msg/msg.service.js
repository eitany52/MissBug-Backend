import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"

export const msgService = {
    query,
    getById,
    save,
    remove
}

async function query() {
    try {
        const collection = await dbService.getCollection('msg')
        const msgs = await collection.find().toArray()
        return msgs
    } catch (error) {
        loggerService.error("Cannot show messages", error)
        throw error
    }
}

async function getById(msgId) {
    try {
        const collection = await dbService.getCollection('msg')
        const criteria = { _id: ObjectId.createFromHexString(msgId) }
        const msg = await collection.findOne(criteria)
        if (!msg) throw new Error(`Cannot get message with _id ${msgId}`)
        const msgToSend = await _aggregateMsg(msg)
        return msgToSend
    } catch (error) {
        loggerService.error("Cannot get message", error)
        throw error
    }
}

async function save(msgToSave, loggedInUser) {
    try {
        const collection = await dbService.getCollection('msg')
        msgToSave.aboutBugId = ObjectId.createFromHexString(msgToSave.aboutBugId)
        msgToSave.byUserId = ObjectId.createFromHexString(msgToSave.byUserId)
        if (msgToSave._id) {
            if (!loggedInUser.isAdmin) throw new Error("Only the admin is allowed to update messages")
            const criteria = { _id: ObjectId.createFromHexString(msgToSave._id) }
            const msgToUpdate = { ...msgToSave }
            delete msgToUpdate._id
            const { modifiedCount } = await collection.updateOne(criteria, { $set: msgToUpdate })
            if (modifiedCount === 0) throw new Error(`Couldn't update message with _id ${msgToSave._id}`)
        }
        else {
            await collection.insertOne(msgToSave)
        }
        return msgToSave
    } catch (error) {
        loggerService.error("Cannot save message", error)
        throw error
    }

}

async function _aggregateMsg(msgToSend) {
    try {
        const collection = await dbService.getCollection('msg')
        const criteria = { _id: msgToSend._id }
        const msg = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup: {
                    localField: 'aboutBugId',
                    from: 'bug',
                    foreignField: '_id',
                    as: 'aboutBug',
                }
            },
            {
                $unwind: '$aboutBug'
            },
            {
                $lookup: {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser',
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $project: {
                    txt: 1,
                    'aboutBug._id': 1,
                    'aboutBug.title': 1,
                    'aboutBug.severity': 1,
                    'byUser._id': 1,
                    'byUser.fullname': 1,
                }
            }
        ]).next()

        return msg
    } catch (error) {
        loggerService.error("Having issues with aggregating message", error)
        throw error
    }
}

async function remove(msgId, loggedInUser) {
    try {
        const collection = await dbService.getCollection('msg')
        if (!loggedInUser.isAdmin) throw new Error("Only the admin is allowed to remove messages")
        const criteria = { _id: ObjectId.createFromHexString(msgId) }
        const { deletedCount } = await collection.deleteOne(criteria)
        if (deletedCount === 0) throw new Error(`Cannot remove message with _id ${msgId}`)
    } catch (error) {
        loggerService.error("Cannot remove message", error)
        throw error
    }

}