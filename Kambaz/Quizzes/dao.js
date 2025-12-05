import model from "./model.js";

export default function QuizzesDao(db) {
  function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function findQuizById(quizId) {
    return model.findById(quizId);
  }

  function createQuiz(courseId) {
    const _id = Date.now().toString();
    return model.create({
      _id,
      course: courseId,
      title: "New Quiz",
      published: false,
      shuffleAnswers: true,
      attempts: [],
      questions: [],
  
      // ADD THESE DEFAULTS
      multipleAttempts: false,
      howManyAttempts: 1,
  
      availableFrom: null,
      availableUntil: null,
  
      accessCode: "", // default no access code
    });
  }
  

  function updateQuiz(quizId, quiz) {
    return model.updateOne({ _id: quizId }, { $set: quiz });
  }

  function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
  }

  async function saveQuestions(quizId, questions) {
    const totalPoints = questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );
    return model.updateOne(
      { _id: quizId },
      { $set: { questions, points: totalPoints } }
    );
  }

  /* -------------------------------------------------
     Add Attempt with proper validation
  --------------------------------------------------- */
  async function addAttempt(quizId, attempt) {
    const quiz = await model.findById(quizId).lean();
    if (!quiz) return null;

    const attemptsForStudent = quiz.attempts?.filter(
      (a) => a.student === attempt.student
    ) || [];

    const attemptNumber = attemptsForStudent.length + 1;

    const newAttempt = {
      student: attempt.student,
      attemptNumber,
      startedAt: new Date(),
      submittedAt: new Date(),
      answers: attempt.answers,
      score: computeScore(quiz, attempt.answers),
    };

    return model.updateOne(
      { _id: quizId },
      { $push: { attempts: newAttempt } }
    );
  }

  /* -------------------------------------------------
     Scoring Logic
  --------------------------------------------------- */
  function computeScore(quiz, answers) {
    let score = 0;

    for (const q of quiz.questions || []) {
      const studentAns = answers.find((a) => a.questionId === q._id);
      if (!studentAns) continue;

      if (q.type === "MCQ") {
        const choice = q.choices?.find((c) => c._id === studentAns.answerText);
        if (choice?.isCorrect) score += q.points;
      }

      if (q.type === "TRUE_FALSE") {
        if (String(q.correctBoolean) === String(studentAns.answerText)) {
          score += q.points;
        }
      }

      if (q.type === "FILL_IN_BLANK") {
        const matches = q.acceptableAnswers?.some(
          (ans) =>
            ans.toLowerCase().trim() ===
            studentAns.answerText.toLowerCase().trim()
        );
        if (matches) score += q.points;
      }
    }

    return score;
  }

  /* -------------------------------------------------
     Find last attempt
  --------------------------------------------------- */
  function findLastAttemptForStudent(quizId, studentId) {
    return model.aggregate([
      { $match: { _id: quizId } },
      { $unwind: "$attempts" },
      { $match: { "attempts.student": studentId } },
      { $sort: { "attempts.attemptNumber": -1 } },
      { $limit: 1 },
      { $project: { _id: 0, attempt: "$attempts" } },
    ]);
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    saveQuestions,
    addAttempt,
    findLastAttemptForStudent,
  };
}
