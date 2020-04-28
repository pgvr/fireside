/* eslint-disable no-await-in-loop */
import bodyParser from "body-parser"
import express from "express"
import { SuccessMsgResponse, SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import CallRepo from "../../database/repository/call.repo"
import ConferenceRepo from "../../database/repository/conference.repo"
import asyncHandler from "../../helpers/asyncHandler"
import { CallUpdate, ConferenceUpdate, getConference } from "../../helpers/conference.helper"

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const confUpdate = req.body as ConferenceUpdate
        if (confUpdate.StatusCallbackEvent === "conference-start") {
            Logger.info("Conference Started")
            // update conference with a callStartedAt Date
            const conference = await getConference(confUpdate.ConferenceSid)
            const participants = await conference.participants().list()
            await ConferenceRepo.updateStart(participants, confUpdate.ConferenceSid)
        } else if (confUpdate.StatusCallbackEvent === "conference-end") {
            Logger.info("Conference Ended")
            const conference = await ConferenceRepo.removeConference(confUpdate.ConferenceSid)
            const now = new Date()
            const callDuration = now.getTime() - conference.callStartedAt.getTime()
            if (callDuration > 120000) {
                Logger.info("Call longer than 2 mins, so add it to DB")
                await CallRepo.create(conference)
            } else {
                Logger.info("Call NOT longer than 2 mins, not adding to DB")
            }
        }
        return new SuccessMsgResponse("Success").send(res)
    }),
)

router.post(
    "/callStatus",
    asyncHandler(async (req, res) => {
        const callUpdate = req.body as CallUpdate
        Logger.info("Call Status Update")
        if (callUpdate.CallStatus === "completed") {
            /**
             * Check conference of corresponding number
             * If there is no "callStartedAt" in the conference object
             * the conference has never started and yet the call is complete
             * Therefore somebody didnt pick up and we need to delete the conference
             * to avoid having the user stuck in the "calling" state
             */
            Logger.info("Call completed")
            const conference = await ConferenceRepo.getConferenceForPhone(callUpdate.Called)
            if (conference && !conference.callStartedAt) {
                // since there are two calls "conference" will not be defined for the second one
                // or the delete will fail
                Logger.info("Deleting Conference because call failed")
                await ConferenceRepo.removeConferenceById(conference._id)
            }
        }
        return new SuccessResponse("Success", null).send(res)
    }),
)

export default router
