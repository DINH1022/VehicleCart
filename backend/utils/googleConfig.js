import { google } from "googleapis";
import dotenv from 'dotenv'
dotenv.config()
export const oauth2client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "postmessage"
);
