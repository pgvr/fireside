import twilio from "twilio"

/**
 * Build the XML required for a basic conference
 * @param welcomeMessage Message to be played upon connection
 * @param conferenceName Friendly conference name
 */
export function buildConference(welcomeMessage: string, conferenceName: string) {
    const { VoiceResponse } = twilio.twiml
    const twiml = new VoiceResponse()
    twiml.say(welcomeMessage)
    twiml.dial().conference(conferenceName)
    return twiml
}

export default { buildConference }
