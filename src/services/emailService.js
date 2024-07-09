require("dotenv").config();

import nodemailer from "nodemailer";
let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: '"Lê Nguyễn Đức Dũng 👻" <ducdung17903@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
    html: `<h3>Xin chào, ${dataSend.patientName}</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bênh online trên Chamsocsuckhoe</p>
            <p>Thông tin đặt lịch khám bệnh</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

            <p>Đây là email tự động. Vui lòng không trả lời lại</p>
            <p>Nếu thông tin gửi là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>

            <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </div>

            <div>Xin chân thành cảm ơn</div>
    `,
  });
};

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
}
module.exports = {
  sendSimpleEmail,
};
