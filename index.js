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
import QuizRoutes from "./Kambaz/Quizzes/routes.js";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

import db from "./Kambaz/Database/index.js";

/* -------------------- DB Connection -------------------- */
const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

/* -------------------- CORS (MUST BE FIRST) -------------------- */
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

/* -------------------- JSON PARSING (BEFORE SESSION) -------------------- */
app.use(express.json());

/* -------------------- SESSION (AFTER CORS + JSON) -------------------- */
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: "lax",
  },
};

if (process.env.SERVER_ENV === "production") {
  app.set("trust proxy", 1);

  sessionOptions.cookie = {
    secure: true,
    sameSite: "none",
  };
}

app.use(session(sessionOptions));

/* -------------------- Routes -------------------- */
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
QuizRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);

Lab5(app);
Hello(app);

/* -------------------- Start Server -------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
