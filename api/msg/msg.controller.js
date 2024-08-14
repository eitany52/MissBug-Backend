import { msgService } from "./msg.service.js"

export const getMsgs = async (req, res) => {
    try {
        const msgs = await msgService.query()
        res.send(msgs)
    } catch (error) {
        console.log("Cannot show messages.", error)
        res.status(500).send("Cannot show messages, please try again later.")
    }
}

export const addMsg = async (req, res) => {
    const { txt, aboutBugId } = req.body
    const loggedInUser = req.loggedInUser
    let msgToSave = {
        txt: txt || '',
        aboutBugId,
        byUserId: loggedInUser._id
    }

    try {
        msgToSave = await msgService.save(msgToSave, loggedInUser)
        res.send(msgToSave)
    } catch (error) {
        console.log("Cannot add message.", error);
        res.status(400).send("Cannot add message.")
    }
}

export const updateMsg = async (req, res) => {
    const { _id, txt, aboutBugId, byUserId } = req.body
    const loggedInUser = req.loggedInUser
    let msgToSave = {
        _id,
        txt: txt || '',
        aboutBugId,
        byUserId
    }

    try {
        msgToSave = await msgService.save(msgToSave, loggedInUser)
        res.send(msgToSave)
    } catch (error) {
        console.log("Cannot update message.", error);
        res.status(400).send("Cannot update message.")
    }
}

export const getMsg = async (req, res) => {
    try {
        const msg = await msgService.getById(req.params.msgId)
        res.send(msg)
    } catch (error) {
        console.log("Cannot get message.", error)
        res.status(400).send("Cannot get message.")
    }
}

export const deleteMsg = async (req, res) => {
    try {
        const loggedInUser = req.loggedInUser
        await msgService.remove(req.params.msgId, loggedInUser)
        res.send("Message deleted successfuly.")
    } catch (error) {
        console.log("Cannot delete message.", error)
        res.status(400).send("Cannot delete message.")
    }
}