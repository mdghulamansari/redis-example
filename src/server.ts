import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import logger from "./utils/logger";
import sequelize from "./config/db.config";

import studentRoutes from "./routes/student.routes";

const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/student", studentRoutes);

// 404 Error
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ msg: "Not Found", data: [] });
});

// START SERVER
app.listen(PORT, async () => {
  logger.info(`App is running at http://localhost:${PORT}`);
  try {
    sequelize.authenticate();
    logger.info("Database connected");
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
});
