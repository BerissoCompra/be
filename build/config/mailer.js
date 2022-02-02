"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
// create reusable transporter object using the default SMTP transport
exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_KEY, // generated ethereal password
    },
});
exports.transporter.verify().then((res) => {
    console.log("Ready for send emails");
});
const sendEmail = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.transporter.sendMail({
        from: ` ${from} ${process.env.GMAIL_USERNAME}`,
        to,
        subject,
        html, // html body
    });
});
exports.sendEmail = sendEmail;
