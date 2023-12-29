import db from '../models';
require('dotenv').config();
import _ from 'lodash';

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                await db.Specialty.create({
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64,
                    name: data.name
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
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let data = {};
                data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })
                console.log('check data specialty :', data)
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;

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
    createSpecialty, getAllSpecialty,
    getDetailSpecialtyById
}