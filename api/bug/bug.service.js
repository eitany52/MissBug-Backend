import { loggerService } from "../../services/logger.service.js"
import { makeId, readJsonFile, saveToJsonFile } from "../../services/util.service.js"

export const bugService = {
    query,
    save,
    getById,
    remove
}
const path = 'data/bugs.json'
const PAGE_SIZE = 4

async function query(filterBy = {}) {
    try {
        let bugs = readJsonFile(path)
        bugs = _filterBugs(bugs, filterBy)
        _sortBugs(bugs, filterBy)
        if ('pageIdx' in filterBy) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
        }
        return bugs
    } catch (error) {
        loggerService.error("Cannot get bugs", error)
        throw error
    }
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
        const bugs = await query()
        if (bugToSave._id) {
            if (!loggedInUser.isAdmin && bugToSave.creator._id !== loggedInUser._id) {
                throw new Error("Cannot update someone else's bug")
            }
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx < 0) {
                throw new Error(`Couldn't update bug with _id ${bugToSave._id}`)
            }
            bugs[bugIdx] = bugToSave
        }
        else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            bugToSave.creator = loggedInUser
            bugs.push(bugToSave)
        }

        saveToJsonFile(path, bugs)
        return bugToSave
    } catch (error) {
        loggerService.error("Cannot save bug", error)
        throw error
    }
}

async function getById(bugId) {
    try {
        const bugs = await query()
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw new Error(`Cannot get bug with _id ${bugId}`)
        return bug
    } catch (error) {
        loggerService.error("Cannot get bug.", error)
        throw error
    }
}

async function remove(bugId, loggedInUser) {
    try {
        let bugs = await query()
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) {
            throw new Error(`Cannot remove bug with _id ${bugId}`)
        }
        if (!loggedInUser.isAdmin && bug.creator._id !== loggedInUser._id) {
            throw new Error("Cannot remove someone else's bug")
        }
        bugs = bugs.filter(bug => bug._id !== bugId)
        saveToJsonFile(path, bugs)
    } catch (error) {
        loggerService.error("Cannot remove bug.", error)
        throw error
    }
}
