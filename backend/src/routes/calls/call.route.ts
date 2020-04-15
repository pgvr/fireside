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

export default router
