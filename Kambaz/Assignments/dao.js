import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter(a => a.course === courseId);
  }

  function deleteAssignment(assignmentId) {
    db.assignments = db.assignments.filter(a => a._id !== assignmentId);
    return { status: "ok" };
  }

  function updateAssignment(assignmentId, updates) {
    const assignment = db.assignments.find(a => a._id === assignmentId);
    if (!assignment) return null;

    Object.assign(assignment, updates);
    return assignment;
  }

  return {
    createAssignment,
    findAssignmentsForCourse,
    deleteAssignment,
    updateAssignment
  };
}