import { defaults } from "lodash";
import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: "Bác sĩ Dũng patient name",
          time: "8:00 - 10:00 thứ ba 7/9/2024",
          doctorName: "Lê Nguyễn Đức Dũng",
          redirectLink: "https://www.youtube.com/watch?v=zJtRBDhU1vo",
        });

        //upsert patient
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });

        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }

        //create a booking record
        resolve({ errCode: 0, errMessage: "Save info patient success" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  postBookAppointment,
};
