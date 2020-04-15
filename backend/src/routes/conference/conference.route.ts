import express from "express"
import twilio from "twilio"
import { NotFoundResponse, SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import { QueueModel } from "../../database/model/queue.model"
import User from "../../database/model/user.model"
import QueueRepo from "../../database/repository/queue.repo"
import asyncHandler from "../../helpers/asyncHandler"
import { buildConference } from "../../helpers/conference.helper"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./conference.schema"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

const router = express.Router()

router.post(
    "/",
    validator(schema.participant, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const incomingParticipant = req.body as User

        // search db for match
        const foundMatch = await QueueRepo.findMatchingParticipant(incomingParticipant)

        if (foundMatch) {
            // connect with match
            Logger.info("Match found, initiating...")
            const conferenceXml = buildConference("Welcome", new Date().getTime().toString())

            const numbers = [incomingParticipant.phone, foundMatch.phone]

            await Promise.all(
                numbers.map((number) => {
                    return client.calls.create({
                        twiml: conferenceXml.toString(),
                        to: number,
                        from: process.env.TWILIO_NUMBER,
                        // Callbacks to update status
                        // statusCallback: "https://www.myapp.com/events",
                        // statusCallbackEvent: ["initiated", "answered"],
                        // statusCallbackMethod: "POST",
                    })
                }),
            )

            return new SuccessResponse("Match found. Initiating Calls.", { queue: false }).send(res)
        }

        // put number in db and wait to be found
        Logger.info("Adding to queue")
        const alreadyExists = await QueueModel.findOne({ phone: incomingParticipant.phone })
        if (alreadyExists) {
            Logger.info("User is already in queue")
            return new SuccessResponse("User is already in queue", { queue: true }).send(res)
        }
        await QueueRepo.addToQueue(incomingParticipant)
        return new SuccessResponse("No match found. Putting in db.", { queue: true }).send(res)
    }),
)

router.post(
    "/leaveQueue",
    validator(schema.participant, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const incomingParticipant = req.body as User
        const removed = await QueueRepo.removeFromQueue(incomingParticipant)
        if (removed) {
            return new SuccessResponse("Removed user from queue", removed).send(res)
        }
        return new NotFoundResponse("User not found in queue")
    }),
)

export default router
