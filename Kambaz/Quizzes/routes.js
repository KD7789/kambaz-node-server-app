import QuizzesDao from "./dao.js";

export default function QuizRoutes(app, db) {
  const dao = QuizzesDao(db);

  // List quizzes for a course
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    const quizzes = await dao.findQuizzesForCourse(req.params.courseId);
    res.json(quizzes);
  });

  // Create quiz
  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    const quiz = await dao.createQuiz(req.params.courseId);
    res.json(quiz);
  });

  // Get quiz
  app.get("/api/quizzes/:quizId", async (req, res) => {
    const quiz = await dao.findQuizById(req.params.quizId);
    res.json(quiz);
  });

  // Update quiz
  app.put("/api/quizzes/:quizId", async (req, res) => {
    const status = await dao.updateQuiz(req.params.quizId, req.body);
    res.json(status);
  });

  // Delete quiz
  app.delete("/api/quizzes/:quizId", async (req, res) => {
    const status = await dao.deleteQuiz(req.params.quizId);
    res.json(status);
  });

  // Save questions
  app.put("/api/quizzes/:quizId/questions", async (req, res) => {
    const status = await dao.saveQuestions(
      req.params.quizId,
      req.body.questions
    );
    res.json(status);
  });

  app.post("/api/quizzes/:quizId/copy", async (req, res) => {
    const { quizId } = req.params;
    const quiz = await quizzesDao.findQuizById(quizId);
  
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
  
    // Clone quiz (deep copy questions)
    const newQuiz = await quizzesDao.createQuiz({
      ...quiz,
      _id: undefined,
      title: quiz.title + " (Copy)",
      published: false,
      availableFrom: null,
      availableUntil: null,
    });
  
    res.json(newQuiz);
  });  

  // -------------------------------------------
  // UPDATED ATTEMPT ROUTE WITH LOGGING
  // -------------------------------------------
  app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    console.log("\n==== QUIZ ATTEMPT START ====");
    console.log("Incoming Body:", req.body);
    console.log("Session User:", req.session["currentUser"]);

    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      console.log("401: No currentUser in session");
      return res.sendStatus(401);
    }

    if (currentUser.role === "FACULTY") {
      console.log("403: Faculty cannot take quizzes");
      return res.status(403).json({ error: "Faculty cannot take quizzes." });
    }

    const quiz = await dao.findQuizById(req.params.quizId);
    console.log("Loaded Quiz:", quiz);

    if (!quiz) {
      console.log("404: Quiz not found");
      return res.sendStatus(404);
    }

    const now = new Date();

    // --- Availability checks ---
    if (quiz.availableFrom) {
      console.log("availableFrom:", quiz.availableFrom);
      if (now < new Date(quiz.availableFrom)) {
        console.log("403: Quiz not available yet");
        return res.status(403).json({ error: "Quiz is not available yet." });
      }
    }

    if (quiz.availableUntil) {
      console.log("availableUntil:", quiz.availableUntil);
      if (now > new Date(quiz.availableUntil)) {
        console.log("403: Quiz has closed");
        return res.status(403).json({ error: "Quiz has closed." });
      }
    }

    // --- Access Code check ---
    console.log("Quiz accessCode:", quiz.accessCode);
    console.log("User provided accessCode:", req.body.accessCode);

    if (quiz.accessCode && quiz.accessCode.trim() !== "") {
      if (!req.body.accessCode || req.body.accessCode !== quiz.accessCode) {
        console.log("403: Invalid access code");
        return res.status(403).json({ error: "Invalid access code." });
      }
    }

    // --- Attempt restrictions ---
    const lastAttempt = await dao.findLastAttemptForStudent(
      req.params.quizId,
      currentUser._id
    );

    console.log("Last attempt record:", lastAttempt);

    const last = lastAttempt[0]?.attempt;

    if (!quiz.multipleAttempts && last) {
      console.log("403: Only one attempt allowed");
      return res.status(403).json({ error: "Only one attempt allowed." });
    }

    if (quiz.multipleAttempts && last) {
      if (last.attemptNumber >= quiz.howManyAttempts) {
        console.log("403: Max attempts reached");
        return res.status(403).json({ error: "Maximum attempts reached." });
      }
    }

    console.log("Attempt is valid → saving...");

    const attempt = {
      student: currentUser._id,
      answers: req.body.answers,
    };

    const status = await dao.addAttempt(req.params.quizId, attempt);

    console.log("Saved Attempt:", status);
    console.log("==== QUIZ ATTEMPT END ====\n");

    res.json(status);
  });

  // -------------------------------------------
  // Get last attempt of current student
  // -------------------------------------------
  app.get("/api/quizzes/:quizId/attempts/me", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);

    const result = await dao.findLastAttemptForStudent(
      req.params.quizId,
      currentUser._id
    );

    res.json(result[0]?.attempt || null);
  });
}
