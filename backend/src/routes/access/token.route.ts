// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import crypto from "crypto"
import express, { Response } from "express"
import { Types } from "mongoose"
import { createTokens, getAccessToken, validateTokenData } from "../../auth/auth.utils"
import { AuthFailureError } from "../../core/ApiError"
import { TokenRefreshResponse } from "../../core/ApiResponse"
import JWT from "../../core/JWT"
import KeystoreRepo from "../../database/repository/keystore.repo"
import UserRepo from "../../database/repository/user.repo"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./access.schema"

const router = express.Router()

router.post(
    "/refresh",
    validator(schema.auth, ValidationSource.HEADER),
    validator(schema.refreshToken),
    asyncHandler(async (req: ProtectedRequest, res: Response) => {
        req.accessToken = getAccessToken(req.headers.authorization) // Express headers are auto converted to lowercase

        const accessTokenPayload = await JWT.decode(req.accessToken)
        validateTokenData(accessTokenPayload)

        const user = await UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub))
        if (!user) throw new AuthFailureError("User not registered")
        req.user = user

        const refreshTokenPayload = await JWT.validate(req.body.refreshToken)
        validateTokenData(refreshTokenPayload)

        if (accessTokenPayload.sub !== refreshTokenPayload.sub) throw new AuthFailureError("Invalid access token")

        const keystore = await KeystoreRepo.find(req.user._id, accessTokenPayload.prm, refreshTokenPayload.prm)

        if (!keystore) throw new AuthFailureError("Invalid access token")
        await KeystoreRepo.remove(keystore._id)

        const accessTokenKey = crypto.randomBytes(64).toString("hex")
        const refreshTokenKey = crypto.randomBytes(64).toString("hex")

        await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey)
        const tokens = await createTokens(req.user, accessTokenKey, refreshTokenKey)

        new TokenRefreshResponse("Token Issued", tokens.accessToken, tokens.refreshToken).send(res)
    }),
)

export default router
