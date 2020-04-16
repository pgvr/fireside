import express, { Request, Response } from "express"
import { SuccessResponse } from "../../core/ApiResponse"
import CallRepo from "../../database/repository/call.repo"
import ConferenceRepo from "../../database/repository/conference.repo"
import QueueRepo from "../../database/repository/queue.repo"
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

export default router
