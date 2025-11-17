import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
    };

    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment; // IMPORTANT: Return the object
  }

  function findEnrollmentsForUser(userId) {
    return db.enrollments.filter((e) => e.user === userId);
  }

  function findEnrollmentsForCourse(courseId) {
    return db.enrollments.filter((e) => e.course === courseId);
  }

  function unenroll(enrollmentId) {
    db.enrollments = db.enrollments.filter((e) => e._id !== enrollmentId);
    return { status: "ok" };
  }

  return {
    enrollUserInCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    unenroll,
  };
}
