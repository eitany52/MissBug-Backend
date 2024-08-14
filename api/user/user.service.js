import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"
import { makeId, readJsonFile, saveToJsonFile } from "../../services/util.service.js"

export const userService = {
    query,
    save,
    getById,
    remove,
    getByUsername
}
const path = 'data/users.json'

async function query(loggedInUser = {}) {
    try {
        if (!loggedInUser.isAdmin) throw new Error("Only the admin is allowed to see the list of users")
        const collection = await dbService.getCollection('user')
        const users = await collection.find().toArray()
        return users
    }
    catch (error) {
        loggerService.error("Cannot get users", error)
        throw error
    }
}

async function save(userToSave, loggedInUser) {
    try {
        const collection = await dbService.getCollection('user')
        if (userToSave._id) {
            if (!loggedInUser.isAdmin) throw new Error("Only the admin is allowed to update users")
            const criteria = { _id: ObjectId.createFromHexString(userToSave._id) }
            const userToUpdate = structuredClone(userToSave)
            delete userToUpdate._id
            const { modifiedCount } = await collection.updateOne(criteria, { $set: userToUpdate })
            if (modifiedCount === 0) throw new Error(`Couldn't update user with _id ${userToSave._id}`)
        }
        else {
            userToSave.score = 100
            userToSave.isAdmin = false
            await collection.insertOne(userToSave)
        }

        return userToSave

    } catch (error) {
        loggerService.error("Cannot save user", error)
        throw error
    }
}

async function getById(userId, loggedInUser) {
    try {
        if (!loggedInUser.isAdmin && loggedInUser._id !== userId) {
            throw new Error("Cannot see someone else's user")
        }
        const collection = await dbService.getCollection('user')
        const criteria = { _id: ObjectId.createFromHexString(userId) }
        const user = await collection.findOne(criteria)
        if (!user) throw new Error(`Cannot get user with _id ${userId}`)

        return user
    } catch (error) {
        loggerService.error("Cannot get user.", error)
        throw error
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const criteria = { username }
        const user = await collection.findOne(criteria)
        return user
    } catch (error) {
        loggerService.error("Cannot get user.", error)
        throw error
    }
}

async function remove(userId, loggedInUser) {
    try {
        if (!loggedInUser.isAdmin) throw new Error("Only the admin is allowed to remove users")
        const collection = await dbService.getCollection('user')
        const criteria = { _id: ObjectId.createFromHexString(userId) }
        const { deletedCount } = await collection.deleteOne(criteria)
        if (deletedCount === 0) throw new Error(`Cannot remove user with _id ${userId}`)

    } catch (error) {
        loggerService.error("Cannot remove user.", error)
        throw error
    }
}
