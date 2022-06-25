import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { setupEndpoints } from "./endpoints.js";

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT;
const UI_URL = process.env.UI_URL;

app.use(
  cors({
    origin: UI_URL,
    credentials: true,
  })
);

setupEndpoints(app);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
