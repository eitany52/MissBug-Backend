import { ObjectId } from "mongodb"
import { dbService } from "../../services/db.service.js"
import { loggerService } from "../../services/logger.service.js"
import { makeId, readJsonFile, saveToJsonFile } from "../../services/util.service.js"

export const bugService = {
    query,
    save,
    getById,
    remove
}
const PAGE_SIZE = 4

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('bug')
        const criteria = _buildCriteria(filterBy)
        const options = _buildOptions(filterBy)
        const bugs = await collection.find(criteria, options).toArray()

        return bugs
    } catch (error) {
        loggerService.error("Cannot get bugs", error)
        throw error
    }

}
function _buildCriteria(filterBy) {
    const criteria = {}
    const { txt, minSeverity, labels } = filterBy

    if (txt) {
        criteria.title = { $regex: txt, $options: 'i' }
    }
    if (minSeverity) {
        criteria.severity = { $gte: minSeverity }
    }
    if (labels && labels.length) {
        const regexQueries = labels.map(label => ({
            labels: { $regex: new RegExp(`^${label}$`, 'i') }
        }))
        criteria.$or = regexQueries;
    }
    return criteria
}

function _buildOptions(filterBy) {
    const options = {}
    const { sortBy, sortDir } = filterBy

    if (sortBy) {
        options.sort = { [sortBy]: sortDir }
    }
    if (sortBy === 'title') {
        options.collation = { locale: 'en', strength: 2 }
    }
    if ('pageIdx' in filterBy) {
        options.skip = filterBy.pageIdx * PAGE_SIZE
        options.limit = PAGE_SIZE
    }

    return options
}

function _filterBugsByLabels(bugs, labels) {
    if (labels && labels.length) {
        bugs = bugs.filter(bug =>
            bug.labels.some(label => {
                const regExp = new RegExp(label, 'i')
                return regExp.test(labels)
            })
        )
    }
    return bugs
}

function _filterBugs(bugs, filterBy) {
    const { txt, minSeverity, labels } = filterBy
    if (txt) {
        const regExp = new RegExp(txt, 'i')
        bugs = bugs.filter(bug => regExp.test(bug.title))
    }
    if (minSeverity) {
        bugs = bugs.filter(bug => bug.severity >= minSeverity)
    }
    if (labels && labels.length) {
        bugs = bugs.filter(bug =>
            bug.labels.some(label => {
                const regExp = new RegExp(label, 'i')
                return regExp.test(labels)
            })
        )
    }

    return bugs
}

function _sortBugs(bugs, filterBy) {
    const { sortBy, sortDir } = filterBy
    if (sortBy === 'title') {
        bugs.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * sortDir)
    }
    else if (sortBy === 'severity') {
        bugs.sort((bug1, bug2) => (bug1.severity - bug2.severity) * sortDir)
    }
    else if (sortBy === 'createdAt') {
        bugs.sort((bug1, bug2) => (bug1.createdAt - bug2.createdAt) * sortDir)
    }
}

async function save(bugToSave, loggedInUser) {
    try {
        const collection = await dbService.getCollection('bug')

        if (bugToSave._id) {
            if (!loggedInUser.isAdmin && bugToSave.creator._id !== loggedInUser._id) {
                throw new Error("Cannot update someone else's bug")
            }
            bugToSave._id = ObjectId.createFromHexString(bugToSave._id)
            const criteria = { _id: bugToSave._id }
            const bugToUpdate = structuredClone(bugToSave)
            delete bugToUpdate._id
            const { modifiedCount } = await collection.updateOne(criteria, { $set: bugToUpdate })

            if (modifiedCount === 0) {
                throw new Error(`Couldn't update bug with _id ${bugToSave._id}`)
            }
        }
        else {
            bugToSave.creator = loggedInUser
            await collection.insertOne(bugToSave)
        }

        return bugToSave

    } catch (error) {
        loggerService.error("Cannot save bug", error)
        throw error
    }
}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection('bug')
        const bug = await collection.findOne({ _id: ObjectId.createFromHexString(bugId) })

        if (!bug) throw new Error(`Cannot get bug with _id ${bugId}`)
        bug.createdAt = bug._id.getTimestamp()

        return bug
    } catch (error) {
        loggerService.error("Cannot get bug.", error)
        throw error
    }
}

async function remove(bugId, loggedInUser) {
    try {
        const collection = await dbService.getCollection('bug')
        const criteria = { _id: ObjectId.createFromHexString(bugId) }
        if (!loggedInUser.isAdmin) criteria['creator._id'] = loggedInUser._id
        const { deletedCount } = await collection.deleteOne(criteria)
        if (deletedCount === 0) throw new Error("Cannot remove someone else's bug")
    } catch (error) {
        loggerService.error("Cannot remove bug.", error)
        throw error
    }
}
