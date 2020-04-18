import twilio from "twilio"
import { baseUrl } from "../config"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

/**
 * Build the XML required for a basic conference
 * @param welcomeMessage Message to be played upon connection
 * @param conferenceName Friendly conference name
 */
export function buildConference(welcomeMessage: string, conferenceName: string) {
    const { VoiceResponse } = twilio.twiml
    const twiml = new VoiceResponse()
    twiml.pause({
        length: 2,
    })
    twiml.say(welcomeMessage)
    twiml.dial().conference(
        {
            statusCallback: `${baseUrl}/webhook`,
            statusCallbackMethod: "POST",
            statusCallbackEvent: ["end", "start", "join", "leave"],
        },
        conferenceName,
    )
    return twiml
}

export interface ConferenceUpdate {
    FriendlyName: string
    ConferenceSid: string
    StatusCallbackEvent: string
    CallSid?: string
}

// export interface Conference {
//     friendlyName: string
//     sid: string
//     status: string
//     uri: string
//     subresourceUris: { participants: string }
// }

// export interface Call {
//     from: string
//     fromFormatted: string
//     to: string
//     toFormatted: string
//     sid: string
//     uri: string
// }

export async function getConference(id: string) {
    const conf = await client.conferences.get(id).fetch()
    return conf
}

export async function getCall(id: string) {
    const call = await client.calls.get(id).fetch()
    return call
}

export default { buildConference, getConference, getCall }
