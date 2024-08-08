import { userService } from "./user.service.js"

export const getUsers = async (req, res) => {
    const loggedInUser = req.loggedInUser
    try {
        const users = await userService.query(loggedInUser)
        res.send(users)
    } catch (error) {
        console.log("Cannot show users.", error)
        res.status(500).send("Cannot show users, please try again later.")
    }
}

export const updateUser = async (req, res) => {
    const { _id, fullname, username, password, score } = req.body
    const loggedInUser = req.loggedInUser
    let userToSave = {
        _id,
        fullname,
        username,
        password,
        score: +score
    }
    try {
        userToSave = await userService.save(userToSave, loggedInUser)
        res.send(userToSave)
    } catch (error) {
        console.log("Cannot update user.", error)
        res.status(400).send("Cannot update user.")
    }
}

export const getUser = async (req, res) => {
    const loggedInUser = req.loggedInUser
    try {
        const user = await userService.getById(req.params.userId, loggedInUser)
        res.send(user)
    } catch (error) {
        console.log("Cannot get user.", error)
        res.status(400).send("Cannot get user.")
    }
}

export const deleteUser = async (req, res) => {
    const loggedInUser = req.loggedInUser
    try {
        await userService.remove(req.params.userId, loggedInUser)
        res.send("user deleted successfuly.")
    } catch (error) {
        console.log("Cannot delete user.", error)
        res.status(400).send("Cannot delete user.")
    }
}