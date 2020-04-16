import express from "express"
import twilio from "twilio"
import { NotFoundResponse, SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import { QueueModel } from "../../database/model/queue.model"
import User from "../../database/model/user.model"
import ConferenceRepo from "../../database/repository/conference.repo"
import QueueRepo from "../../database/repository/queue.repo"
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
        let foundMatch = await QueueRepo.findMatchingParticipant(incomingParticipant)

        if (foundMatch) {
            // connect with match
            Logger.info("Match found, initiating...")

            // found match is coming from queue db collection, create a new object of it to remove _id, etc.
            foundMatch = <User>{
                phone: foundMatch.phone,
                city: foundMatch.city,
                interests: foundMatch.interests,
                job: foundMatch.job,
                language: foundMatch.language,
            }
            // Call being initiated, create conference in db to keep track
            await ConferenceRepo.create(foundMatch, incomingParticipant)

            const conferenceXml = buildConference(
                "Welcome to your fireside chat. Enjoy!",
                new Date().getTime().toString(),
            )

            const numbers = [incomingParticipant.phone, foundMatch.phone]

            // ensure we have participants as users, if not create them as anon
            await UserRepo.addUsersIfDontExist([incomingParticipant, foundMatch])

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
        const alreadyExists = await QueueModel.findOne({ phone: incomingParticipant.phone })
        if (alreadyExists) {
            Logger.info("User is already in queue")
            return new SuccessResponse("User is already in queue", { queue: true }).send(res)
        }
        Logger.info("Adding to queue")
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
