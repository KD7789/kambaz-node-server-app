import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // Enroll a user
  app.post("/api/enrollments", (req, res) => {
    const { userId, courseId } = req.body;
    const enrollment = dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });

  // Unenroll
  app.delete("/api/enrollments/:enrollmentId", (req, res) => {
    const { enrollmentId } = req.params;
    const status = dao.unenroll(enrollmentId);
    res.json(status);
  });

  // Get enrollments for user
  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    const list = dao.findEnrollmentsForUser(userId);
    res.json(list);
  });

  // Get enrollments for course
  app.get("/api/courses/:courseId/enrollments", (req, res) => {
    const { courseId } = req.params;
    const list = dao.findEnrollmentsForCourse(courseId);
    res.json(list);
  });
}
