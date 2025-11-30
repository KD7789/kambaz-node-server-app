import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
  async function findAllCourses() {
    return await model.find();
  }

  async function findCoursesForEnrolledUser(userId) {
    const { enrollments } = db;
    const courses = await model.find();

    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
  }

  // ⭐ UPDATED createCourse to match professor’s version
  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return await model.create(newCourse);
  }

  async function deleteCourse(courseId) {
    await model.deleteOne({ _id: courseId });

    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);

    return { status: "deleted" };
  }

  async function updateCourse(courseId, courseUpdates) {
    return await model.findByIdAndUpdate(courseId, courseUpdates, {
      new: true,
    });
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
