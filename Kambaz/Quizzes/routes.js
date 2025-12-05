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

  // -------------------------------------------
  // UPDATED: Student submits quiz attempt
  // -------------------------------------------
  app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);

    // Faculty cannot attempt quizzes
    if (currentUser.role === "FACULTY") {
      return res.status(403).json({ error: "Faculty cannot take quizzes." });
    }

    const quiz = await dao.findQuizById(req.params.quizId);
    const now = new Date();

    // Availability: not open yet
    if (quiz.availableFrom && now < new Date(quiz.availableFrom)) {
      return res.status(403).json({ error: "Quiz is not available yet." });
    }

    // Availability: closed
    if (quiz.availableUntil && now > new Date(quiz.availableUntil)) {
      return res.status(403).json({ error: "Quiz has closed." });
    }

    // Access Code enforcement
    if (quiz.accessCode && quiz.accessCode.trim() !== "") {
      if (!req.body.accessCode || req.body.accessCode !== quiz.accessCode) {
        return res.status(403).json({ error: "Invalid access code." });
      }
    }

    // Multiple Attempts validation
    const lastAttempt = await dao.findLastAttemptForStudent(
      req.params.quizId,
      currentUser._id
    );

    const last = lastAttempt[0]?.attempt;

    // Quiz does NOT allow multiple attempts
    if (!quiz.multipleAttempts && last) {
      return res.status(403).json({ error: "Only one attempt allowed." });
    }

    // Quiz allows multiple attempts but has max attempts
    if (quiz.multipleAttempts && last) {
      if (last.attemptNumber >= quiz.howManyAttempts) {
        return res.status(403).json({ error: "Maximum attempts reached." });
      }
    }

    const attempt = {
      student: currentUser._id,
      answers: req.body.answers,
    };

    const status = await dao.addAttempt(req.params.quizId, attempt);
    res.json(status);
  });

  // Get last attempt of current student
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
