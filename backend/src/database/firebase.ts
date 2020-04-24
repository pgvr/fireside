import * as admin from "firebase-admin"
import { firebaseClientMail, firebasePrivateKey, firebaseProjectId } from "../config"

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: firebaseProjectId,
        privateKey: firebasePrivateKey,
        clientEmail: firebaseClientMail,
    }),
    databaseURL: "https://fireside-70f44.firebaseio.com",
})

const db = admin.firestore()
export default db
export async function createCustomToken(uid: string) {
    try {
        const token = await admin.auth().createCustomToken(uid)
        return token
    } catch (error) {
        console.log("custom token creation failed")
        console.log(error)
        return ""
    }
}
