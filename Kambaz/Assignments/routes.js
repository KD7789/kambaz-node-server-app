import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // CREATE
  const createAssignment = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = { ...req.body, course: courseId };
      const newAssignment = await dao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };

  // FIND ALL FOR COURSE
  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };

  // FIND ONE
  const findAssignmentById = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignment = await dao.findAssignmentById(assignmentId);
      if (!assignment) return res.status(404).json({ error: "Assignment not found" });
      res.json(assignment);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };

  // DELETE
  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const status = await dao.deleteAssignment(assignmentId);
      res.json(status);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };

  // UPDATE
  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const updated = await dao.updateAssignment(assignmentId, req.body);
      if (!updated) return res.status(404).json({ error: "Assignment not found" });
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  };

  // ROUTES
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);

  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}
