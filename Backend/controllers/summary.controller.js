import Summary from "../models/summary.model.js";
import mongoose from "mongoose";


const getSummariesByUserId = async (req, res, next) => {
    try {
        const userId = req?.user._id
        // console.log("User ID in getSummariesByUserId: ", userId);
        
        const summaries = await Summary.aggregate([
            {
                $lookup: {
                  from: "meetings",
                  localField: "meetingId",
                  foreignField: "_id",
                  as: "fetchedMeetings"
                }
              },
              {
                $unwind: "$fetchedMeetings"
              },
              {
                $match: {
                  "fetchedMeetings.userId": new mongoose.Types.ObjectId(userId)
                }
              },
              {
                $lookup: {
                  from: "users",
                  localField: "fetchedMeetings.userId",
                  foreignField: "_id",
                  as: "userDetails"
                }
              },
              {
                $unwind: "$userDetails"
              },
        ])
        
        if (summaries.length > 0) {
            return res.status(200).json({ success: true, summaries });
        } else {
            return res.status(404).json({ success: false, message: "No summaries found" });
        }

    } catch (error) {
        console.log("Error fetching summaries:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { getSummariesByUserId }