import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getSummariesByUserId } from "../controllers/summary.controller.js"

const router = express.Router()

router.get("/fetch-summary", verifyJWT, getSummariesByUserId)

export default router