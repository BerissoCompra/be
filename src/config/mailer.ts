import nodemailer = require('nodemailer')
import dotenv = require('dotenv');

dotenv.config();

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USERNAME, // generated ethereal user
      pass: process.env.GMAIL_KEY, // generated ethereal password
    },
});

transporter.verify().then((res)=>{
    console.log("Ready for send emails")
})

export const sendEmail = async(from: string, to: string, subject: string,  html: string)=>{
  await transporter.sendMail({
      from: ` ${from} ${process.env.GMAIL_USERNAME}`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
  });
} 