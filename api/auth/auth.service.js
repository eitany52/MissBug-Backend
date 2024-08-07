import bcrypt from 'bcrypt'
import Cryptr from 'cryptr'
import { loggerService } from "../../services/logger.service.js"
import { userService } from "../user/user.service.js"

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')

export const authService = {
    login,
    signup,
    getLoginToken,
    validateToken
}

async function login(username, password) {
    try {
        if (!username || !password) {
            throw new Error("Cannot have empty fields")
        }
        const user = await userService.getByUsername(username)
        if (!user) throw new Error("Username not found")
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new Error('Invalid username or password')
        return {
            _id: user._id,
            fullname: user.fullname,
            isAdmin: user.isAdmin
        }
    } catch (error) {
        loggerService.error("Cannot login", error)
        throw error
    }
}

async function signup(credentials) {
    try {
        const { fullname, username, password } = credentials
        if (!fullname || !username || !password) {
            throw new Error("Cannot have empty fields")
        }
        const userExists = await userService.getByUsername(username)
        if (userExists) throw new Error("Username already exists")
        const saltRounds = 10
        const hash = await bcrypt.hash(password, saltRounds)
        const user = await userService.save({
            fullname,
            username,
            password: hash
        })
        return {
            _id: user._id,
            fullname: user.fullname
        }
    } catch (error) {
        loggerService.error("Cannot signup", error)
        throw error
    }
}

function getLoginToken(user) {
    const strUser = JSON.stringify(user)
    const loginToken = cryptr.encrypt(strUser)
    return loginToken
}

function validateToken(token) {
    try {
        const strUser = cryptr.decrypt(token)
        const loggedInUser = JSON.parse(strUser)
        return loggedInUser
    } catch (error) {
        console.log("Invalid login token");
        return null
    }
}
