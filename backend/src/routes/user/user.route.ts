// eslint-disable-next-line import/no-unresolved
import { ProtectedRequest } from "app-request"
import express from "express"
import authentication from "../../auth/authentication"
import { SuccessMsgResponse, SuccessResponse } from "../../core/ApiResponse"
import CallRepo from "../../database/repository/call.repo"
import ConferenceRepo from "../../database/repository/conference.repo"
import KeystoreRepo from "../../database/repository/keystore.repo"
import QueueRepo from "../../database/repository/queue.repo"
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
    validator(schema.update, ValidationSource.BODY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { city, interests, job } = req.body
        const user: any = { city, interests, job }
        user._id = req.user._id

        const updatedUser = await UserRepo.updateInfo(user)
        return new SuccessResponse("Updated user: ", updatedUser).send(res)
    }),
)

router.post(
    "/deleteEverything",
    asyncHandler(async (req: ProtectedRequest, res) => {
        await UserRepo.deleteUser(req.user)
        await KeystoreRepo.remove(req.keystore._id)
        await QueueRepo.removeFromQueue(req.user)
        const conference = await ConferenceRepo.getConferenceForPhone(req.user.phone)
        if (conference) {
            await ConferenceRepo.removeConferenceById(conference._id)
        }
        // delete all calls for users phone
        await CallRepo.deleteCallsForPhone(req.user.phone)
        return new SuccessMsgResponse("Deleted Everything").send(res)
    }),
)

export default router
