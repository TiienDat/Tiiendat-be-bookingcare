import clinicService from "../services/clinicService"


let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinic()
        return res.status(200).json(infor)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from servver"
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinicById(req.query.id)
        return res.status(200).json(infor)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from servver"
        })
    }
}
module.exports = {
    createClinic, getAllClinic,
    getDetailClinicById
}