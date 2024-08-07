import { json } from "express"
import { bugService } from "./bug.service.js"

export const getBugs = async (req, res) => {
    const { txt, minSeverity, labels, sortBy, sortDir, pageIdx } = req.query
    const filterBy = {
        txt,
        minSeverity: +minSeverity,
        labels: labels || [],
        sortBy,
        sortDir: +sortDir
    }
    if (pageIdx) filterBy.pageIdx = +pageIdx
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (error) {
        console.log("Cannot show bugs.", error)
        res.status(500).send("Cannot show bugs, please try again later.")
    }
}

export const addBug = async (req, res) => {
    const { title, description, severity, labels } = req.body
    const loggedInUser = req.loggedInUser
    let bugToSave = {
        title: title || '',
        description: description || '',
        severity: +severity,
        labels: labels || []
    }

    try {
        bugToSave = await bugService.save(bugToSave, loggedInUser)
        res.send(bugToSave)
    } catch (error) {
        console.log("Cannot add bug.", error);
        res.status(400).send("Cannot add bug.")
    }
}

export const updateBug = async (req, res) => {
    const {
        _id,
        title,
        description,
        severity,
        labels,
        createdAt,
        creator } = req.body
    const loggedInUser = req.loggedInUser
    let bugToSave = {
        _id,
        title,
        description,
        severity: +severity,
        labels,
        createdAt,
        creator
    }

    try {
        bugToSave = await bugService.save(bugToSave, loggedInUser)
        res.send(bugToSave)
    } catch (error) {
        console.log("Cannot update bug.", error);
        res.status(400).send("Cannot update bug.")
    }
}

export const getBug = async (req, res) => {
    try {
        let visitedBugs = req.cookies.visitedBugs
        visitedBugs = visitedBugs ? JSON.parse(visitedBugs) : []
        const bugId = req.params.bugId
        if (!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId)
        }
        if (visitedBugs.length > 3) {
            return res.status(401).send('Wait for a bit')
        }
        const bug = await bugService.getById(req.params.bugId)
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 1000 * 15 })
        res.send(bug)
    } catch (error) {
        console.log("Cannot get bug.", error)
        res.status(400).send("Cannot get bug.")
    }
}

export const deleteBug = async (req, res) => {
    try {
        const loggedInUser = req.loggedInUser
        await bugService.remove(req.params.bugId, loggedInUser)
        res.send("Bug deleted successfuly.")
    } catch (error) {
        console.log("Cannot delete bug.", error)
        res.status(400).send("Cannot delete bug.")
    }
}