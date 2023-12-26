import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import {config} from "./src/constants/config.js";
import assignmentRoutes from "./src/api/assignmentRoutes.js";
import errorHandler from "./src/core/middlewares/errorHandler.js";
import userRoutes from "./src/api/userRoutes.js";
import groupRoutes from "./src/api/groupRoutes.js";
import studentRoutes from "./src/api/studentRoutes.js";
import subjectRoutes from "./src/api/subjectRoutes.js";
import professorRoutes from "./src/api/professorRoutes.js";
import promotionRoutes from "./src/api/promotionRoutes.js";
import submissionRoutes from "./src/api/submissionRoutes.js";

/**
 * Sets up Cross-Origin Resource Sharing (CORS) for an Express.js app
 */
const setupCORS = (app, allowedOrigins) => {
  let corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
};

/**
 * Sets up a database connection using the provided configuration parameters
 */
const setupDatabase = (config) => {
  mongoose
    .connect(config.mongo.atlas_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((r) => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.log("Error connecting to MongoDB", e);
    });
};

/**
 * Sets up the Express application with specified configurations
 */
const setupExpress = (app, port) => {
  app.use("/api/assignments", assignmentRoutes);
  app.use("/api/groups", groupRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/professors", professorRoutes);
  app.use("/api/promotions", promotionRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/submissions", submissionRoutes);
  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`Server is running : http://localhost:${port}`);
  });
};

// Initializes an instance of the Express application
const app = express();

// Configures the Express application
app.use(express.json());

setupCORS(app, config.security.cors.allowedOrigins);
setupDatabase(config);
setupExpress(app, config.port);
