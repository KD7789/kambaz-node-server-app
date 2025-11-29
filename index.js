import express from "express";
import mongoose from "mongoose";

import cors from "cors";
import "dotenv/config";
import session from "express-session";

import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import UserRoutes from "./Kambaz/Users/routes.js";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

import db from "./Kambaz/Database/index.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);

const app = express();

/* -------------------- CORS -------------------- */
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

/* -------------------- Sessions -------------------- */
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: "lax",
  },
};

// Production settings for Render / Heroku
if (process.env.SERVER_ENV === "production") {
  app.set("trust proxy", 1); // REQUIRED for Render

  sessionOptions.cookie = {
    secure: true,         // forces HTTPS
    sameSite: "none",     // allows cross-site cookies
  };
}

app.use(session(sessionOptions));

/* -------------------- Middleware -------------------- */
app.use(express.json());

/* -------------------- Routes -------------------- */
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);

Lab5(app);
Hello(app);

/* -------------------- Start Server -------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
