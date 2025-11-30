import AssignmentModel from "./model.js";

export default function AssignmentsDao(db) {
  // CREATE
  async function createAssignment(assignment) {
    const newAssignment = await AssignmentModel.create(assignment);
    return newAssignment;
  }

  // FIND ALL FOR COURSE
  async function findAssignmentsForCourse(courseId) {
    return AssignmentModel.find({ course: courseId });
  }

  // FIND ONE
  async function findAssignmentById(assignmentId) {
    return AssignmentModel.findById(assignmentId);
  }

  // DELETE
  async function deleteAssignment(assignmentId) {
    return AssignmentModel.deleteOne({ _id: assignmentId });
  }

  // UPDATE
  async function updateAssignment(assignmentId, updates) {
    return AssignmentModel.findByIdAndUpdate(
      assignmentId,
      updates,
      { new: true }
    );
  }

  return {
    createAssignment,
    findAssignmentsForCourse,
    findAssignmentById,
    deleteAssignment,
    updateAssignment,
  };
}
