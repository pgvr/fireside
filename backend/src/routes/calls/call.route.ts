// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import express, { Response } from "express"
import authentication from "../../auth/authentication"
import { BadRequestError } from "../../core/ApiError"
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

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use("/", authentication)
/*-------------------------------------------------------------------------*/

router.post(
    "/submit",
    validator(schema.submit, ValidationSource.BODY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { submittedInterests, callId }: { submittedInterests: string[]; callId: string } = req.body
        const { phone } = req.user
        // get latest complete call because that is where the submission goes
        const call = await CallRepo.getCallById(callId)
        if (!call) throw new BadRequestError("Call does not exist")

        if (submittedInterests.length > call.commonInterests.length)
            throw new BadRequestError("You submitted more interests than there are common interests")

        if (call.guessedInterests && call.guessedInterests.length > 0) {
            // already submitted once
            return new SuccessResponse("You already submitted to this call", call.guessedInterests).send(res)
        }
        // get correct guesses
        const intersection = call.commonInterests.filter((x) =>
            submittedInterests.map((i) => i.toLowerCase()).includes(x.toLowerCase()),
        )
        Logger.info(`Guessed correctly: ${intersection.join(" ")}`)
        // 50 points for each correct guess
        let points = intersection.length * 50
        const { firstCall } = call
        // grant 100 for first call, 30 for every following call
        if (firstCall) {
            points += 100
        } else {
            points += 30
        }
        // update call with guessed interests
        await CallRepo.submitGuesses(callId, submittedInterests, points)
        // update user profile with points
        await UserRepo.updatePoints(phone, points)
        return new SuccessResponse("Guess Submitted", {
            guessedCorrect: intersection.length,
            total: call.commonInterests.length,
            points,
            firstCall,
        }).send(res)
    }),
)

router.get(
    "/stillInQueue",
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { phone } = req.user
        const queueObj = await QueueRepo.getEntryByPhone(phone)
        if (queueObj) {
            return new SuccessResponse("Still in queue", { queue: true }).send(res)
        }
        return new SuccessResponse("Not in queue anymore", { queue: false }).send(res)
    }),
)

router.get(
    "/isCallActive",
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { phone } = req.user
        const conference = await ConferenceRepo.getConferenceForPhone(phone)
        if (conference) {
            // call in progress
            return new SuccessResponse("Success", { callActive: true }).send(res)
        }
        // calls ordered desc, so first one must be the new one because the conference has ended
        const calls = await CallRepo.getCallsByPhone(phone)
        // call must be done since there is no conference anymore
        return new SuccessResponse("Success", { callActive: false, call: calls[0] }).send(res)
    }),
)

router.get(
    "/",
    asyncHandler(async (req: ProtectedRequest, res: Response) => {
        const { phone } = req.user
        const calls = await CallRepo.getCallsByPhone(phone)
        return new SuccessResponse("Success", calls).send(res)
    }),
)

router.post(
    "/rate",
    validator(schema.rate, ValidationSource.BODY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { rating, callId } = req.body
        const { phone } = req.user
        const call = await CallRepo.getCallById(callId)

        if (call.phone !== phone) return new BadRequestError("Call does not belong to token phone number")

        Logger.info(`Rating call with ${rating}`)
        const dbCall = await CallRepo.rateCall(callId, rating)
        return new SuccessResponse("Rated Call", dbCall).send(res)
    }),
)

router.get(
    "/single/:callId",
    asyncHandler(async (req: ProtectedRequest, res: Response) => {
        const { phone } = req.user
        const { callId } = req.params
        const call = await CallRepo.getCallById(callId)
        if (!call) return new BadRequestError("Call does not exist")
        if (call.phone !== phone) return new BadRequestError("Call does not belong to token phone number")
        return new SuccessResponse("Success", call).send(res)
    }),
)

export default router
