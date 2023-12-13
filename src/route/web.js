import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import specialtyController from "../controllers/specialtyController"
import clinicController from "../controllers/clinicController"

let router = express.Router();

let initWebRoutes = (app) => {
    //Home Controller
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);
    //User Controller
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-users', userController.handleCreateUsers);
    router.delete('/api/delete-users', userController.handleDeleteUsers);
    router.put('/api/edit-users', userController.handleEditUsers);
    router.get('/api/all-code', userController.getAllCode);
    //Doctor Controller
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctors', doctorController.postInfoDoctors);
    router.get('/api/get-detail-doctors-by-id', doctorController.getDetailDoctorById);
    router.get('/api/get-markdown-doctors', doctorController.getMarkdownDoctors);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);

    router.post('/api/send-remedy', doctorController.sendRemedy);
    //Patient Controller
    router.post('/api/patient-book-appoinment', patientController.postBookAppointment);
    router.post('/api/patient-verify-appoinment', patientController.postVerifyAppointment);
    //Specialty Controller
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    //Clinic Controller
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);


    return app.use("/", router);
}

module.exports = initWebRoutes;