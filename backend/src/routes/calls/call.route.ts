import express, { Request, Response } from "express"
import { SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import CallRepo from "../../database/repository/call.repo"
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
        const latestCalls = await CallRepo.getCallsByPhone(phone)
        Logger.info("latestCalls")
        Logger.info(latestCalls)
        // no call exists yet, so not active
        if (latestCalls.length === 0) {
            return new SuccessResponse("Success", { callActive: false }).send(res)
        }
        // call exists, but the latest one is completed, so there is no active call
        if (latestCalls[0].completedAt) {
            return new SuccessResponse("Success", { callActive: false }).send(res)
        }
        // this means there is a call that has no "completedAt" ==> call is active
        return new SuccessResponse("Success", { callActive: true }).send(res)
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
