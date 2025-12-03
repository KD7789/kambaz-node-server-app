import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema(
  {
    _id: String,
    text: String,
    isCorrect: Boolean,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    type: {
      type: String,
      enum: ["MCQ", "TRUE_FALSE", "FILL_IN_BLANK"],
      required: true,
    },
    title: String,
    points: { type: Number, default: 1 },
    text: String, // WYSIWYG HTML

    // MCQ
    choices: [choiceSchema],

    // TRUE/FALSE
    correctBoolean: Boolean,

    // FILL IN BLANK
    acceptableAnswers: [String],
  },
  { _id: false }
);

const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    answerText: String,
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    student: { type: String, ref: "UserModel" },
    attemptNumber: Number,
    startedAt: Date,
    submittedAt: Date,
    score: Number,
    answers: [answerSchema],
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },

    // Basic metadata
    title: { type: String, default: "New Quiz" },
    description: String,

    // Publish state
    published: { type: Boolean, default: false },

    // Quiz settings
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },

    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "IMMEDIATELY" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },

    availableFrom: Date,
    availableUntil: Date,
    dueDate: Date,

    questions: [questionSchema],
    attempts: [attemptSchema],
  },
  { collection: "quizzes" }
);

export default quizSchema;