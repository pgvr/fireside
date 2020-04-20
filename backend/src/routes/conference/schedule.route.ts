// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import express from "express"
import { Types } from "mongoose"
import twilio from "twilio"
import { localApiKey } from "../../config"
import { AuthFailureError, BadRequestError } from "../../core/ApiError"
import { NotFoundResponse, SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import QueueUser from "../../database/model/queue.model"
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

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use(
    "/",
    validator(schema.auth, ValidationSource.HEADER),
    asyncHandler(async (req, res, next) => {
        const { apikey } = req.headers
        Logger.info(`auth api key ${apikey} ${localApiKey}`)
        if (apikey && localApiKey && apikey !== localApiKey) throw new AuthFailureError("Wrong API Key")
        Logger.info("api key success")
        return next()
    }),
)
/*-------------------------------------------------------------------------*/

router.post(
    "/conference",
    validator(schema.scheduledConference, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const incomingParticipant = await UserRepo.findByPhone(req.body.phone)

        if (!incomingParticipant) throw new BadRequestError("User not registered")

        // search db for match
        let foundMatch = await QueueRepo.findMatchingParticipant(incomingParticipant)

        if (foundMatch) {
            // connect with match
            Logger.info("Scheduled Match found, initiating...")

            // found match is coming from queue db collection, create a new object of it to remove _id, etc.
            foundMatch = <QueueUser>{
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
                Types.ObjectId().toHexString(),
            )

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

            return new SuccessResponse("Scheduled Match found. Initiating Calls.", { queue: false }).send(res)
        }

        // put number in db and wait to be found
        const alreadyExists = await QueueRepo.getEntryByPhone(incomingParticipant.phone)
        if (alreadyExists) {
            Logger.info("User is already in queue")
            return new SuccessResponse("User is already in queue", { queue: true }).send(res)
        }
        Logger.info("Adding Schedule User to queue")
        await QueueRepo.addToQueue(incomingParticipant)
        return new SuccessResponse("No match found. Putting in db.", { queue: true }).send(res)
    }),
)

router.post(
    "/leave",
    asyncHandler(async (req: ProtectedRequest, res) => {
        const incomingParticipant = await UserRepo.findByPhone(req.user.phone)

        if (!incomingParticipant) throw new BadRequestError("User not registered")

        const removed = await QueueRepo.removeFromQueue(incomingParticipant)
        if (removed) {
            return new SuccessResponse("Removed user from queue", removed).send(res)
        }
        return new NotFoundResponse("User not found in queue").send(res)
    }),
)

export default router
