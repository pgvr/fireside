// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import express from "express"
import authentication from "../../auth/authentication"
import { SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"

const router = express.Router()

router.use(authentication)

router.get(
    "/me",
    asyncHandler(async (req: ProtectedRequest, res) => {
        return new SuccessResponse("This is protected", req.user).send(res)
    }),
)

export default router
