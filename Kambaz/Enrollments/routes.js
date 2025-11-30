import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // Enroll a user
  app.post("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    const enrollment = await dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });

  // Unenroll a user from a course
  app.delete("/api/enrollments/:userId/:courseId", async (req, res) => {
    const { userId, courseId } = req.params;
    const status = await dao.unenrollUserFromCourse(userId, courseId);
    res.json(status);
  });

  // ⭐ Get all COURSES for a USER
  app.get("/api/users/:userId/courses", async (req, res) => {
    const { userId } = req.params;
    const list = await dao.findCoursesForUser(userId);
    res.json(list);
  });

  // ⭐ Get all USERS for a COURSE
  app.get("/api/courses/:courseId/users", async (req, res) => {
    const { courseId } = req.params;
    const list = await dao.findUsersForCourse(courseId);
    res.json(list);
  });
}
