// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import express from "express"
import authentication from "../../auth/authentication"
import { BadRequestError } from "../../core/ApiError"
import { SuccessResponse } from "../../core/ApiResponse"
import SettingRepo from "../../database/repository/setting.repo"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./setting.schema"

const router = express.Router()

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use("/", authentication)
/*-------------------------------------------------------------------------*/

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
        const { days, hours, numPerDay } = req.body
        const setting: any = { days, hours, numPerDay }
        setting.userId = req.user._id

        const createdSetting = await SettingRepo.create(setting)
        return new SuccessResponse("Created setting: ", createdSetting).send(res)
    }),
)

router.post(
    "/update",
    validator(schema.setting, ValidationSource.BODY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { days, hours, numPerDay } = req.body

        const setting: any = { days, hours, numPerDay }
        setting.userId = req.user._id

        const updatedSetting = await SettingRepo.update(setting)
        return new SuccessResponse("Updated setting: ", updatedSetting).send(res)
    }),
)

router.delete(
    "/delete",
    asyncHandler(async (req: ProtectedRequest, res) => {
        const deletedSetting = await SettingRepo.delete(req.user._id)
        if (!deletedSetting) throw new BadRequestError("Setting does not exist.")
        return new SuccessResponse("Deleted setting", deletedSetting).send(res)
    }),
)

export default router
