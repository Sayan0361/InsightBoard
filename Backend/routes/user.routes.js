import express from "express"
import { loginUser, logoutUser, signUpUser, refreshAccessToken } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { fetchUser } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/signup", signUpUser)
router.post("/login", loginUser)
router.post("/logout", verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.get("/fetch-user", verifyJWT, fetchUser)

export default router