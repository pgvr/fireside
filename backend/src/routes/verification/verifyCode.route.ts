import express from "express"
import twilio from "twilio"
import { AuthFailureResponse, SuccessResponse } from "../../core/ApiResponse"
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
    validator(schema.verify, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const verification = await verifyService.verificationChecks.create({ to: req.body.phone, code: req.body.code })
        if (verification.status === "approved") {
            return new SuccessResponse("Phone number verified.", verification.status).send(res)
        }
        return new AuthFailureResponse("Invalid SMS Token").send(res)
    }),
)

export default router
