import express from "express"
import twilio from "twilio"
import { SuccessResponse } from "../../core/ApiResponse"
import User from "../../database/model/user.model"
import UserRepo from "../../database/repository/user.repo"
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
        const foundMatch = await UserRepo.findMatchingParticipant(incomingParticipant)

        if (foundMatch) {
            // connect with match
            const conferenceXml = buildConference("Welcome", new Date().getTime().toString()) // TODO: Should probably be something unique

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
        // TODO: implement queue collection
        // await UserRepo.createUser(incomingParticipant)
        return new SuccessResponse("No match found. Putting in db.", incomingParticipant).send(res)
    }),
)

export default router
