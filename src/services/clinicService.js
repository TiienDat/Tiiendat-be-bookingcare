import clinicController from "../controllers/clinicController"
import db from "../models"
import _ from "lodash"

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64,
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: "Ok",
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let data = {};

                data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name']
                })
                if (data) {
                    //do something
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })

                    data.doctorClinic = doctorClinic;

                } else data = {}
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createClinic, getAllClinic,
    getDetailClinicById
}