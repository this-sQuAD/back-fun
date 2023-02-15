import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config()

const mailerUser = process.env.MAILER_USER;
const mailerPass = process.env.MAILER_PASS;
const mailerHost = process.env.MAILER_HOST;
const mailerPort = process.env.MAILER_PORT;


const transport = nodemailer.createTransport({
  host: mailerHost,
  port: mailerPort,
  secure: false,
  auth: {
    user: mailerUser,
    pass: mailerPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default transport;