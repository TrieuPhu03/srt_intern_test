import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import routes from "./routes";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://todo.trieuphu.io.vn"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({
    success: true,
    message: "OK",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);
