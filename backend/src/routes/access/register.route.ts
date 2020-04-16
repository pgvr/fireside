import bcrypt from "bcrypt"
import crypto from "crypto"
import express from "express"
import { createTokens } from "../../auth/auth.utils"
import { BadRequestError } from "../../core/ApiError"
import { SuccessResponse } from "../../core/ApiResponse"
import User from "../../database/model/user.model"
import UserRepo from "../../database/repository/user.repo"
import asyncHandler from "../../helpers/asyncHandler"
import validator from "../../helpers/validator"
import schema from "./access.schema"

const router = express.Router()

router.post(
    "/",
    validator(schema.signup),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findByPhone(req.body.phone)
        if (user && user.password) throw new BadRequestError("User already registered")

        const accessTokenKey = crypto.randomBytes(64).toString("hex")
        const refreshTokenKey = crypto.randomBytes(64).toString("hex")
        const passwordHash = await bcrypt.hash(req.body.password, 10)

        const { user: createdUser, keystore } = await UserRepo.create(
            <User>{
                phone: req.body.phone,
                password: passwordHash,
                interests: req.body.interests,
                city: req.body.city,
                job: req.body.job,
                language: req.body.language,
            },
            accessTokenKey,
            refreshTokenKey,
        )
        const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey)
        new SuccessResponse("Signup Successful", {
            user: createdUser,
            tokens,
        }).send(res)
    }),
)

export default router
