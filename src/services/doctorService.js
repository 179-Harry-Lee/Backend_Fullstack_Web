import { where } from "sequelize";
import db from "../models/index";
require("dotenv").config();
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({ errCode: 0, data: users });
    } catch (error) {
      reject(error);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({ errCode: 0, data: doctors });
    } catch (error) {
      reject(error);
    }
  });
};

let saveDetailInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: {
              doctorId: inputData.doctorId,
            },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.updatedAt = new Date();
            await doctorMarkdown.save();
          }
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor doctor success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        reject({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};

        resolve({ errCode: 0, data: data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
        resolve({ errCode: 1, errMessage: "Missing require parameter" });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formattedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        console.log("existing:", existing);
        console.log("schedule:", schedule);

        //Compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        console.log("To create:", toCreate);

        //Create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({ errCode: 0, errMessage: "OK" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        reject({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!dataSchedule) dataSchedule = [];

        resolve({ errCode: 0, data: dataSchedule });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInfoDoctor: saveDetailInfoDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
};
