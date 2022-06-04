import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { setupEndpoints } from './endpoints.js';

const app = express();

app.use(bodyParser.json());

const UI_HOST = process.env.UI_HOST;
const UI_PORT = process.env.UI_PORT;
const API_PORT = process.env.API_PORT;

app.use(
  cors({
    origin: `http://${UI_HOST}:${UI_PORT}`,
    credentials: true,
  })
);

setupEndpoints(app);

app.listen(API_PORT, () => {
  console.log(`Server is listening on port ${API_PORT}`);
});
