import express from 'express'
import { addUser, deleteUser, getUser, getUsers, updateUser } from './user.controller.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/', requireAuth, getUsers)
router.get('/:userId', requireAuth, getUser)
router.post('/', requireAuth, addUser)
router.put('/', requireAuth, updateUser)
router.delete('/:userId', requireAuth, deleteUser)

export const userRoutes = router