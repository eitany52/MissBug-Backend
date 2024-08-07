import { authService } from "./auth.service.js"

export const signup = async (req, res) => {
    const { fullname, username, password} = req.body
    const credentials = {
        fullname,
        username,
        password
    }
    try {
        const user = await authService.signup(credentials)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    } catch (error) {
        console.log("Failed to signup", error)
        res.status(400).send("Failed to signup")
    }
}
export const login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    } catch (error) {
        console.log("Failed to login", error)
        res.status(401).send("Failed to login")
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('loginToken')
        res.send("Logged out successfully")
    } catch (error) {
        console.log("Failed to logout", error)
        res.status(400).send("Failed to logout")
    }
}