import express from "express"
import { saveMeetings } from "../controllers/meeting.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", verifyJWT,saveMeetings)

export default router;