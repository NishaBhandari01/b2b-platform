import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import rfqRoutes from "./routes/rfq.routes.js";
import quotationRoutes from "./routes/quotation.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import messageRoutes from "./routes/message.routes.js";
import productRoutes from "./routes/product.routes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();
setupSwagger(app);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use((req, res, next) => {
  console.log("GLOBAL BODY CHECK:", req.body);
  next();
});
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/rfq", rfqRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/products", productRoutes);

export default app;
