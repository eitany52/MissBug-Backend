import express from 'express'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'
import { addMsg, deleteMsg, getMsg, getMsgs, updateMsg } from './msg.controller.js'
const router = express.Router()

router.get('/', getMsgs)
router.get('/:msgId', getMsg)
router.post('/', requireAuth, addMsg)
router.put('/', requireAuth, updateMsg)
router.delete('/:msgId', requireAuth, deleteMsg)

export const msgRoutes = router