// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import express from "express"
import authentication from "../../auth/authentication"
import { SuccessResponse } from "../../core/ApiResponse"
import UserRepo from "../../database/repository/user.repo"
import asyncHandler from "../../helpers/asyncHandler"
import validator, { ValidationSource } from "../../helpers/validator"
import schema from "./user.schema"

const router = express.Router()

router.get(
    "/exists/:phone",
    validator(schema.phone, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const { phone } = req.params
        const user = await UserRepo.findByPhone(phone)
        if (user) {
            return new SuccessResponse("This is protected", true).send(res)
        }
        return new SuccessResponse("This is protected", false).send(res)
    }),
)

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use("/", authentication)
/*-------------------------------------------------------------------------*/

router.get(
    "/me",
    asyncHandler(async (req: ProtectedRequest, res) => {
        return new SuccessResponse("This is protected", { user: req.user }).send(res)
    }),
)

router.post(
    "/update",
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { user } = req.body
        user._id = req.user._id

        await UserRepo.updateInfo(user)
        return new SuccessResponse("Updated user: ", { user }).send(res)
    }),
)

export default router
