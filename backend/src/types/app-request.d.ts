import { Request } from "express"
import Keystore from "../database/model/keystore.model"
import User from "../database/model/user.model"

declare interface PublicRequest extends Request {
    apiKey: string
}

declare interface RoleRequest extends PublicRequest {
    currentRoleCode: string
}

declare interface ProtectedRequest extends RoleRequest {
    user: User
    accessToken: string
    keystore: Keystore
}

declare interface Tokens {
    accessToken: string
    refreshToken: string
}
