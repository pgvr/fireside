/* eslint-disable no-await-in-loop */
import bodyParser from "body-parser"
import express from "express"
import { SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import CallRepo from "../../database/repository/call.repo"
import ConferenceRepo from "../../database/repository/conference.repo"
import asyncHandler from "../../helpers/asyncHandler"
import { ConferenceUpdate, getConference } from "../../helpers/conference.helper"

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const confUpdate = req.body as ConferenceUpdate
        if (confUpdate.StatusCallbackEvent === "conference-start") {
            // create call for participants in db
            Logger.info("Conference Started")
            // update conference with a callStartedAt Date
            const conference = await getConference(confUpdate.ConferenceSid)
            const participants = await conference.participants().list()
            await ConferenceRepo.updateStart(participants, confUpdate.ConferenceSid)
        } else if (confUpdate.StatusCallbackEvent === "conference-end") {
            // update call with length and status
            Logger.info("Conference Ended")
            const conference = await ConferenceRepo.removeConference(confUpdate.ConferenceSid)
            await CallRepo.create([conference.phoneOne, conference.phoneTwo], conference)
        } else {
            // handle everything else
        }
        // put number in db and wait to be found
        // TODO: implement queue collection
        // await UserRepo.createUser(incomingParticipant)
        return new SuccessResponse("No match found. Putting in db.", null).send(res)
    }),
)

export default router
