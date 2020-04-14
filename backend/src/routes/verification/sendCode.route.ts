import express from "express"
import twilio from "twilio"
import { SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./verification.schema"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifyServiceId = process.env.TWILIO_VERIFY_ID
const client = twilio(accountSid, authToken)
const verifyService = client.verify.services(verifyServiceId)

const router = express.Router()

router.post(
    "/",
    validator(schema.send, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const verification = await verifyService.verifications.create({ to: req.body.phone, channel: "sms" })
        return new SuccessResponse("Sent verification code", verification).send(res)
    }),
)

export default router
