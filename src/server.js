import express from "express";
import bodyParser from "body-parser";
import viewEngine from "../src/config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "../src/config/conectDB";
import cros from "cors";

require('dotenv').config();


let app = express();
app.use(cros({ credentials: true, origin: true }));

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))


viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log('backend nodejs running on the port :' + port)
})