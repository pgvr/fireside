# 🔥 Fireside - Twilio Hackathon
Welcome to Fireside, a project inspired by the [Twilio](https://www.twilio.com/) Hackthon on [Dev.to](https://dev.to/). 👨‍💻

You can find the app [here](https://fireside.netlify.app/)

## About Fireside
Fireside connects strangers via phone calls based on common interests. As boredom, loneliness and social isolation have risen during these trying times, we thought a good, old-fashioned phone call could be a good distraction.

To make it more fun you can try to guess those common interests after the call to gather "sparks". That way you have a goal that can act as a talking point should it ever feel awkward (it probably will 😉).

tl;dr:

😊 Have fun
⏺ Step outside your comfort zone
👫 Make friends

## Set up

### Requirements

- [Node.js](https://nodejs.org/)
- A Twilio account - [sign up](https://www.twilio.com/try-twilio)
- A [Mongodb instance](https://www.mongodb.com/)

### Twilio Account Settings

This application requires you to have a Twilio Account to get the necessary Account SID and Auth Token. Furthermore, you need a twilio number and the ID of your Twilio Verify Service.

| Config&nbsp;Value | Description                                                                                                                                                  |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account&nbsp;Sid  | Your primary Twilio account identifier - find this [in the Console](https://www.twilio.com/console).                                                         |
| Auth&nbsp;Token   | Used to authenticate - [just like the above, you'll find this here](https://www.twilio.com/console).                                                         |
| Phone&nbsp;number | A Twilio phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164) - you can [get one here](https://www.twilio.com/console/phone-numbers/incoming). |
| Verify&nbsp;ID | The ID of the service that is used to verify phone numbers via SMS. Set it up [here](https://www.twilio.com/console/verify/services). |

### Ngrok

This application requires [Ngrok](https://ngrok.com/) in development to make the backend available to Twilios Webhooks. Just point it at the port of the backend.

### .ENV

With all these requirements in place you should be able to fill out the `.env` files.

For the frontend you only need to adjust `.env.development` to the current Ngrok URL so the Vue App can talk to the backend.

The `.env` setup for the backend is a litte bit more elaborate. You can find a sample file in the repo which can be used as a starter for creating the `.env` file.

#### Key Generation

To sign the JWT Tokens you need to generate your own pair of RSA keys.

Private:
`openssl genrsa -out private.pem 2048`

Public:
`openssl rsa -in private.pem -pubout -out public.pem`

Base64 encode both keys and put them into the `.env` file and keep them secret.

### Local development

After the above requirements have been met:

1. Clone this repository and `cd` into it

    ```bash
    git clone git@github.com:patrickgoeler/fireside.git
    cd fireside
    ```

2. Install dependencies

    In both `frontend` and `backend` run

    ```bash
    npm install
    ```

3. Set your environment variables

    Create a `backend/.env` file and fill it out with the setup above.

4. Run the application

    Start Ngrok and point it at your backend port, adjust `frontend/.env.development` and `backend/.env` with the new Ngrok Url. Run `npm run serve` in `frontend` and `npm run watch` in `backend`. (You need concurrently for the watch command. `npm i -g concurrently`) 

5. Navigate to [http://localhost:8080](http://localhost:8080)

    You should see the Vue App running and that's it!
