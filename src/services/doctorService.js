import { raw } from 'body-parser';
import db from '../models';
require('dotenv').config();
import emailService from './emailService'
import _ from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        include: [
                            {
                                model: db.Specialty, as: 'specialtyData', attributes: ['name']
                            }
                        ]
                    },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Doctor_Infor,
                        include: [
                            {
                                model: db.Specialty, as: 'specialtyData', attributes: ['name']
                            }
                        ]
                    },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item
                })
            }
            resolve({
                errCode: 0,
                data
            });
        } catch (error) {
            reject(error)
        }
    })
}
let checkRequireFileds = (data) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment',
        'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId'
    ]
    let isValid = true;
    let element = '';
    for (let i = 0; i < arr.length; i++) {
        if (!data[arr[i]]) {
            isValid = false;
            element = arr[i]
            break
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequireFileds(data)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter :${checkObj.element}`
                })
            } else {
                //upsert to Markdown
                if (data && data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    })
                } else if (data.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = data.contentHTML;
                        doctorMarkdown.contentMarkdown = data.contentMarkdown;
                        doctorMarkdown.description = data.description;
                        // doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }

                //upsert to Doctor Infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: data.doctorId
                    },
                    raw: false
                })
                if (doctorInfor) {
                    doctorInfor.doctorId = data.doctorId;
                    doctorInfor.priceId = data.selectedPrice;
                    doctorInfor.provinceId = data.selectedProvince;
                    doctorInfor.paymentId = data.selectedPayment;
                    doctorInfor.nameClinic = data.nameClinic;
                    doctorInfor.addressClinic = data.addressClinic;
                    doctorInfor.note = data.note;
                    doctorInfor.specialtyId = data.specialtyId;
                    doctorInfor.clinicId = data.clinicId;
                    await doctorInfor.save()
                } else {
                    await db.Doctor_Infor.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayment,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        note: data.note,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor success'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true

                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');

                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getMarkdownDoctors = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter! '
                })
            } else {
                let data = await db.Markdown.findOne({
                    where: {
                        doctorId: id
                    },
                    attributes: {
                        exclude: ['specialtyId', 'clinicId']
                    }
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                console.log('check data send :---------------', schedule)
                //get all existing data
                // let existing = await db.Schedule.findAll(
                //     {
                //         where: { doctorId: data.doctorId, date: data.formatedDate },
                //         attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                //         raw: true,
                //     })
                // //convert date
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }
                // console.log('check data send2 :---------------', existing)
                //compare difference
                // let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                //     return a.timeType === b.timeType && a.date === b.date;
                // });
                // console.log('chech to create:', toCreate)
                //create data
                // if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(schedule, { returning: true });
                // }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
                //
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ['doctorId', 'id']
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missng require parameter!"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['doctorId', 'id']
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');

                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                },
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeData', attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.patientId || !data.doctorId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let appoinment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false,
                })
                if (appoinment) {
                    appoinment.statusId = 'S3'
                    await appoinment.save()
                }
                await emailService.sendAttachement(data)
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: appoinment
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    getMarkdownDoctors: getMarkdownDoctors,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}