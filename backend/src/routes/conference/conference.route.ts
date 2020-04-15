import express from "express"
import twilio from "twilio"
import { SuccessResponse } from "../../core/ApiResponse"
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
        await QueueRepo.addToQueue(incomingParticipant)
        return new SuccessResponse("No match found. Putting in db.", { queue: true }).send(res)
    }),
)

export default router
