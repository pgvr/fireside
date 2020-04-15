import express, { Request, Response } from "express"
import { SuccessResponse } from "../../core/ApiResponse"
import CallRepo from "../../database/repository/call.repo"
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

export default router
