import express, { Request, Response } from "express"
import { SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import CallRepo from "../../database/repository/call.repo"
import ConferenceRepo from "../../database/repository/conference.repo"
import QueueRepo from "../../database/repository/queue.repo"
import UserRepo from "../../database/repository/user.repo"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./call.schema"

const router = express.Router()

router.get(
    "/:phone",
    validator(schema.phone, ValidationSource.PARAM),
    asyncHandler(async (req: Request, res: Response) => {
        const { phone } = req.params
        const calls = await CallRepo.getCallsByPhone(phone)
        return new SuccessResponse("Success", calls).send(res)
    }),
)

router.get(
    "/isCallActive/:phone",
    validator(schema.phone, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const { phone } = req.params
        const conference = await ConferenceRepo.getConferenceForPhone(phone)
        if (conference) {
            // call in progress
            return new SuccessResponse("Success", { callActive: true }).send(res)
        }
        // call must be done since there is no conference anymore
        return new SuccessResponse("Success", { callActive: false }).send(res)
    }),
)

router.get(
    "/stillInQueue/:phone",
    asyncHandler(async (req, res) => {
        const { phone } = req.params
        const queueObj = await QueueRepo.getEntryByPhone(phone)
        if (queueObj) {
            return new SuccessResponse("Still in queue", { queue: true }).send(res)
        }
        return new SuccessResponse("Not in queue anymore", { queue: false }).send(res)
    }),
)

router.post(
    "/submit",
    validator(schema.submit, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const { phone, submittedInterests }: { phone: string; submittedInterests: string[] } = req.body
        // get latest complete call because that is where the submission goes
        const [call] = await CallRepo.getLatestCall(phone)
        if (call.guessedInterests) {
            // already submitted once
            return new SuccessResponse("You already submitted to this call", call.guessedInterests).send(res)
        }
        // get correct guesses
        const intersection = call.commonInterests.filter((x) =>
            submittedInterests.map((i) => i.toLowerCase()).includes(x.toLowerCase()),
        )
        Logger.info(`Guessed correctly: ${intersection.join(" ")}`)
        let points = intersection.length * 50
        points += 30 // call bonus
        // update call with guessed interests
        await CallRepo.submitGuesses(phone, intersection)
        // update user profile with points
        await UserRepo.updatePoints(phone, points)
        return new SuccessResponse("Guess Submitted", { guessedCorrect: intersection, points }).send(res)
    }),
)

router.post(
    "/rate",
    validator(schema.rate, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const { phone, rating }: { phone: string; rating: number } = req.body
        Logger.info(`Rating call with ${rating}`)
        const dbCall = await CallRepo.rateLatestCall(phone, rating)
        return new SuccessResponse("Rated Call", dbCall).send(res)
    }),
)

export default router
