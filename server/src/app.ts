import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();
setupSwagger(app);

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

export default app;
