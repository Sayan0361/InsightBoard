import Users from "../models/user.model.js"
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
    try {
        const user = await Users.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()


        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken, refreshToken}

    } catch (error) {
        return res.status(500).json({message: "Token generation failed"})
    }
}


const signUpUser = async(req, res, next) => {
    try {
        
        const {email, password, name} = req.body;
        // console.log(email, password, name);
        

        if(!email || !password || !name)
            return res.status(400).json({message: "Please provide all the required fields"})

        const existedUser = await Users.findOne({email})
        if(existedUser) return res.status(400).json({message: "User already exists"})

        const newUser = await Users.create({
            email,
            password,
            name
        })

        // console.log("New User: ", newUser);
        

        const createdUser = await Users.findById(newUser._id).select("-password")
        if(!createdUser) return res.status(500).json({message: "User not created"})

        return res.status(201).json({message: "User created successfully", createdUser})

    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const loginUser = async(req, res, next) => {
    try {
        
        const {email, password} = req.body;
        // console.log(email, password);
        

        if(!email || !password) return res.status(401).json({message: "Insuffucient credentials"})

        const user = await Users.findOne({email})
        if(!user) return res.status(404).json({message: "User not found"})

        const isPasswordValid = await user.isPasswordMatch(password)
        if(!isPasswordValid) return res.status(401).json({message: "Incorrect Password"})

        const {accessToken, refreshToken} = await generateTokens(user._id)
        // console.log("accessToken: ",accessToken);
        

        const loggedInUser = await Users.findById(user._id)
                                .select("-password -refreshToken")

        const options = {
            httpOnly: true,
            sameSite: "lax"
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User logged in successfully",
            loggedInUser,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(500).json({message: "Login Failed"})
    }
}

const logoutUser = async(req, res, next) => {
    try {
        
        await Users.findByIdAndUpdate(
            req.user._id,
            {
                $set: {refreshToken: undefined}
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            sameSite: "lax"
        }

        return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json({message: "User logged out successfully"})

    } catch (error) {
        return res.status(500).json({message: "User logout failed"})
    }
}


const fetchUser = async (req, res, next) => {
    try {
        const userId = req.user._id
        console.log("User ID in fetchUser: ", userId);
        
        const user = await Users.findById(userId).select("-password")
        const dbUserId = user?._id
        if(!user) return res.status(404).json({message: "User not found"})

        return res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        // Get refresh token from cookies
        const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer","");
        
        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
        }

        // Verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find user by the ID in the token
        const user = await Users.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token: User not found" });
        }

        // Verify the refresh token matches the one in the database
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token: Token mismatch" });
        }

        // Generate new access token
        const accessToken = await user.generateAccessToken();
        
        // Set cookie options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        };

        // Send the new access token in both cookie and response
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .json({
                message: "Access token refreshed successfully",
                accessToken
            });

    } catch (error) {
        console.error("Error refreshing access token:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid refresh token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Refresh token expired" });
        }
        return res.status(500).json({ message: "Internal server error while refreshing token" });
    }
}

export {signUpUser, loginUser, logoutUser, fetchUser, refreshAccessToken}