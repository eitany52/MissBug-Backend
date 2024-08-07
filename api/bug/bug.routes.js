import express from 'express'
import { addBug, deleteBug, getBug, getBugs, updateBug } from './bug.controller.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'
const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.post('/', requireAuth, addBug)
router.put('/', requireAuth, updateBug)
router.delete('/:bugId', requireAuth, deleteBug)

export const bugRoutes = router