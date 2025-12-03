import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    course: { type: String, ref: "CourseModel", required: true },
    points: { type: Number, default: 100 },

    // --- UI fields you want to preserve ---
    group: { type: String, default: "ASSIGNMENTS" },
    gradeDisplay: { type: String, default: "Percentage" },
    submissionType: { type: String, default: "Online" },
    onlineEntryOptions: { type: [String], default: [] },
    assignTo: { type: String, default: "Everyone" },

    // --- date fields ---
    dueDate: { type: Date },
    availableFrom: { type: Date },
    availableUntil: { type: Date },
  },
  {
    collection: "assignments",
  }
);

export default assignmentSchema;
