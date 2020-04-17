import crypto from "crypto"
import express from "express"
import twilio from "twilio"
import { createTokens } from "../../auth/auth.utils"
import { BadRequestError } from "../../core/ApiError"
import { AuthFailureResponse, SuccessResponse } from "../../core/ApiResponse"
import User from "../../database/model/user.model"
import KeystoreRepo from "../../database/repository/keystore.repo"
import UserRepo from "../../database/repository/user.repo"
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
    "/register",
    validator(schema.register, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const verification = await verifyService.verificationChecks.create({ to: req.body.phone, code: req.body.code })
        if (verification.status === "approved") {
            // create user if dont exists
            const user = <User>{
                phone: req.body.phone,
                city: req.body.city,
                interests: req.body.interests,
                job: req.body.job,
                language: req.body.language,
            }
            // tokens
            const accessTokenKey = crypto.randomBytes(64).toString("hex")
            const refreshTokenKey = crypto.randomBytes(64).toString("hex")

            const { user: createdUser } = await UserRepo.create(user, accessTokenKey, refreshTokenKey)
            const tokens = await createTokens(user, accessTokenKey, refreshTokenKey)
            return new SuccessResponse("Phone number verified.", { createdUser, tokens }).send(res)
        }
        return new AuthFailureResponse("Invalid SMS Token").send(res)
    }),
)

router.post(
    "/login",
    validator(schema.login, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const verification = await verifyService.verificationChecks.create({ to: req.body.phone, code: req.body.code })
        if (verification.status === "approved") {
            const { phone } = req.body
            const user = await UserRepo.findByPhone(phone)
            if (!user) throw new BadRequestError("User not registered")

            // tokens
            const accessTokenKey = crypto.randomBytes(64).toString("hex")
            const refreshTokenKey = crypto.randomBytes(64).toString("hex")

            // eslint-disable-next-line no-underscore-dangle
            await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey)
            const tokens = await createTokens(user, accessTokenKey, refreshTokenKey)
            return new SuccessResponse("Phone number verified.", { user, tokens }).send(res)
        }
        return new AuthFailureResponse("Invalid SMS Token").send(res)
    }),
)

router.post(
    "/send",
    validator(schema.send, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const verification = await verifyService.verifications.create({ to: req.body.phone, channel: "sms" })
        return new SuccessResponse("Sent verification code", verification).send(res)
    }),
)

export default router
