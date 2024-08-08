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

async function query(loggedInUser = {}, isAllowed = false) {
    try {
        if (!loggedInUser.isAdmin && !isAllowed) throw new Error("Only the admin is allowed to see the list of users")
        const users = readJsonFile(path)
        return users
    }
    catch (error) {
        loggerService.error("Cannot get users", error)
        throw error
    }
}

async function save(userToSave, loggedInUser) {
    try {
        const users = await query(loggedInUser, true)
        if (userToSave._id) {
            if (!loggedInUser.isAdmin) throw new Error("Only the admin is allowed to update users")
            const userIdx = users.findIndex(user => user._id === userToSave._id)
            if (userIdx < 0) throw new Error(`Couldn't update user with _id ${userToSave._id}`)
            users[userIdx] = userToSave
        }
        else {
            userToSave._id = makeId()
            userToSave.score = 100
            users.push(userToSave)
        }

        saveToJsonFile(path, users)
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
        const users = await query(loggedInUser, true)
        const user = users.find(user => user._id === userId)
        if (!user) throw new Error(`Cannot get user with _id ${userId}`)
        return user
    } catch (error) {
        loggerService.error("Cannot get user.", error)
        throw error
    }
}

async function getByUsername(username) {
    try {
        const users = await query({}, true)
        const user = users.find(user => user.username === username)
        return user
    } catch (error) {
        loggerService.error("Cannot get user.", error)
        throw error
    }
}

async function remove(userId, loggedInUser) {
    try {
        if (!loggedInUser.isAdmin) throw new Error("Only the admin is allowed to remove users")
        const users = await query(loggedInUser)
        const userIdx = users.findIndex(user => user._id === userId)
        if (userIdx < 0) throw new Error(`Cannot remove user with _id ${userId}`)
        users.splice(userIdx, 1)
        saveToJsonFile(path, users)
    } catch (error) {
        loggerService.error("Cannot remove user.", error)
        throw error
    }
}
