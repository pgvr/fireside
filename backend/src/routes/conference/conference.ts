import express from "express"
import { SuccessResponse } from "../../core/ApiResponse"
import asyncHandler from "../../helpers/asyncHandler"

const router = express.Router()

router.post(
    "/",
    asyncHandler(async (req, res, next) => {
        return new SuccessResponse("Successful", null).send(res)
    }),
)

export default router
