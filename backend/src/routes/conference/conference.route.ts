import express from "express"
import twilio from "twilio"
import { SuccessResponse } from "../../core/ApiResponse"
import Participant from "../../database/model/participant.model"
import ParticipantRepo from "../../database/repository/participant.repo"
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
        const incomingParticipant = req.body as Participant

        // search db for match
        const foundMatch = await ParticipantRepo.findMatchingParticipant(incomingParticipant)

        if (foundMatch) {
            // connect with match
            const conferenceXml = buildConference("Welcome", "New Conference Name") // TODO: Should probably be something unique

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

            return new SuccessResponse("Successful", foundMatch).send(res)
        }
        // put number in db and wait to be found
        await ParticipantRepo.createParticipant(incomingParticipant)
        return new SuccessResponse("No match found. Putting in db.", incomingParticipant).send(res)
    }),
)

export default router
