import express from "express";
import bodyParser from "body-parser"; // query parameter
import viewEngine from "./config/viewEngine";
import initWebRouets from "./route/web";
import connectDB from "./config/connectDB"; // connect;
import cors from "cors";
require("dotenv").config();

let app = express();
app.use(cors({ credentials: true, origin: true }));
//config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({}));

viewEngine(app);
initWebRouets(app);

connectDB();

let port = process.env.PORT;
app.listen(port, () => {
  console.log(`Backend Nodejs is running on http://localhost:${port}`);
});
