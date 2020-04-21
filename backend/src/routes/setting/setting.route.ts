// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import express from "express"
import authentication from "../../auth/authentication"
import { AuthFailureError } from "../../core/ApiError"
import { SuccessMsgResponse, SuccessResponse } from "../../core/ApiResponse"
import Logger from "../../core/Logger"
import SettingRepo from "../../database/repository/setting.repo"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./setting.schema"

const router = express.Router()

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use("/", authentication)
/*-------------------------------------------------------------------------*/

// TODO: un-copypaste
router.get(
    "/me",
    asyncHandler(async (req: ProtectedRequest, res) => {
        const userId = req.user._id
        const setting = await SettingRepo.findByUserId(userId)

        return new SuccessResponse("This is protected", setting).send(res)
    }),
)

router.post(
    "/create",
    validator(schema.setting, ValidationSource.BODY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { userId, days, hours, numPerDay } = req.body
        const setting: any = { userId, days, hours, numPerDay }

        await SettingRepo.create(setting)
        return new SuccessResponse("Created setting: ", { setting }).send(res)
    }),
)

router.post(
    "/update",
    validator(schema.setting, ValidationSource.BODY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { userId, days, hours, numPerDay } = req.body
        Logger.info(`userId: ${userId} - req.user._id: ${req.user._id}`)
        if (userId !== req.user._id) throw new AuthFailureError("Incorrect userId")
        const setting: any = { userId, days, hours, numPerDay }

        await SettingRepo.update(setting)
        return new SuccessResponse("Updated setting: ", { setting }).send(res)
    }),
)

router.delete(
    "/delete",
    asyncHandler(async (req: ProtectedRequest, res) => {
        await SettingRepo.delete(req.user._id)
        return new SuccessMsgResponse("Deleted setting").send(res)
    }),
)

export default router
