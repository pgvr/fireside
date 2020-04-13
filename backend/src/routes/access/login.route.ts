import bcrypt from "bcrypt"
import crypto from "crypto"
import express from "express"
import { createTokens } from "../../auth/auth.utils"
import { AuthFailureError, BadRequestError } from "../../core/ApiError"
import { SuccessResponse } from "../../core/ApiResponse"
import KeystoreRepo from "../../database/repository/keystore.repo"
import UserRepo from "../../database/repository/user.repo"
import asyncHandler from "../../helpers/asyncHandler"
import validator from "../../helpers/validator"
import schema from "./access.schema"

const router = express.Router()

export default router.post(
    "/",
    validator(schema.userCredential),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findByPhone(req.body.phone)
        if (!user) throw new BadRequestError("User not registered")
        if (!user.password) throw new BadRequestError("Credential not set")

        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) throw new AuthFailureError("Authentication failure")

        const accessTokenKey = crypto.randomBytes(64).toString("hex")
        const refreshTokenKey = crypto.randomBytes(64).toString("hex")

        // eslint-disable-next-line no-underscore-dangle
        await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey)
        const tokens = await createTokens(user, accessTokenKey, refreshTokenKey)

        new SuccessResponse("Login Success", {
            user,
            tokens,
        }).send(res)
    }),
)
