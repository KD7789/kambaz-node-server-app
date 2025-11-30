import model from "./model.js";

export default function EnrollmentsDao(db) {
  // ----------------------------
  // 1. Enroll user in a course
  // ----------------------------
  function enrollUserInCourse(userId, courseId) {
    return model.create({
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
    });
  }

  // ----------------------------
  // 2. Find all courses for a user
  // ----------------------------
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enr) => enr.course);
  }

  // ----------------------------
  // 3. Find all users for a course
  // ----------------------------
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enr) => enr.user);
  }

  // ----------------------------
  // 4. Unenroll ONE user from a course
  // ----------------------------
  function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  // ----------------------------
  // 5. Unenroll ALL users from a course  ⭐ NEW
  // ----------------------------
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    enrollUserInCourse,
    findCoursesForUser,
    findUsersForCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,   // ⭐ ADD THIS
  };
}
