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

  // Update quiz (details editor)
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

  // Student submits quiz
  app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
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
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const result = await dao.findLastAttemptForStudent(
      req.params.quizId,
      currentUser._id
    );

    res.json(result[0]?.attempt || null);
  });
}