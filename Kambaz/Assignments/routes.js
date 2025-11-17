import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // CREATE
  const createAssignment = (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body, course: courseId };
    const newAssignment = dao.createAssignment(assignment);
    res.json(newAssignment);
  };

  // FIND ALL FOR COURSE
  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  // FIND ONE (IMPORTANT FOR REFRESH)
  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = db.assignments.find(a => a._id === assignmentId);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    res.json(assignment);
  };

  // DELETE
  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    res.json(status);
  };

  // UPDATE
  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body);
    if (!updated) return res.status(404).json({ error: "Assignment not found" });
    res.json(updated);
  };

  // ROUTES
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);

  // NEW IMPORTANT ROUTE
  app.get("/api/assignments/:assignmentId", findAssignmentById);

  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}
