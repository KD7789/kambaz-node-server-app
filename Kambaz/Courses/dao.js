import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
  async function findAllCourses() {
    return model.find({}, { name: 1, description: 1, img: 1 });
  }  

  async function findCoursesForEnrolledUser(userId) {
    const { enrollments } = db;
    const courses = await model.find({}, { name: 1, description: 1, img: 1 });

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
    const { enrollments } = db;
  
    db.enrollments = enrollments.filter(
      (e) => e.course !== courseId
    );
  
    return model.deleteOne({ _id: courseId });
  }  

  async function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }  

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
