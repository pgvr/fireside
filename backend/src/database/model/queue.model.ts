import { model } from "mongoose"
import User, { schema } from "./user.model"

export const DOCUMENT_NAME = "member"
export const COLLECTION_NAME = "queue"

export const QueueModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME)
