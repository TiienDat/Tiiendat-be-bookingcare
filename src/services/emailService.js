require('dotenv').config();
import { lastIndexOf } from 'lodash';
import nodemailer from 'nodemailer'


let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking Care Clone 👻" <nguyentiendat120299@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend)

    });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin Chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám online trên Booking Care Clone</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian : ${dataSend.time}</b></div>
        <div><b>Bác sĩ : ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng, vui lòng click vào link bên dưới để xác nhận và hoàn thành thủ tục đặt lịch khám bệnh.</p>
        <div><a href=${dataSend.redirectLink} target=_blank>Click here</a></div>
        <div>Xin chân thành cảm ơn quý khách đã sử dụng dịch vụ !</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Hello !  ${dataSend.patientName}</h3>
        <p>You have received this email because you booked your appointment online on Booking Care Clone</p>
        <p>Information on scheduling medical examinations</p>
        <div><b>Time : ${dataSend.time}</b></div>
        <div><b>Doctor : ${dataSend.doctorName}</b></div>
        <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment scheduling procedure.</p>
        <div><a href=${dataSend.redirectLink} target=_blank>Click here</a></div>
        <div>Thank you very much for using the service !</div>
        `
    }
    return result
}
let sendAttachement = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Booking Care Clone 👻" <nguyentiendat120299@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("Base64,")[1],
                encoding: 'base64'
            }
        ]
    });
}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin Chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám online trên Booking Care Clone</p>
        <p>Thông tin đơn thuốc / hóa đơn được gửi trong file đính kèm</p>
        <div>Xin chân thành cảm ơn quý khách đã sử dụng dịch vụ !</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Hello ${dataSend.patientName} !</h3>
        <p>You have received this email because you booked your appointment online on Booking Care Clone</p>
        <p>Prescription / invoice information is sent in the attached file</p>
        <div>Thank you very much for using the service !</div>
        `
    }
    return result
}
module.exports = {
    sendSimpleEmail, getBodyHTMLEmail,
    sendAttachement
}
