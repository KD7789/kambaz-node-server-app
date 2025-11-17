import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import enrollments from "./enrollments.js";

// Create ONE persistent object
const db = {
  courses: JSON.parse(JSON.stringify(courses)),
  modules: JSON.parse(JSON.stringify(modules)),
  assignments: JSON.parse(JSON.stringify(assignments)),
  users: JSON.parse(JSON.stringify(users)),
  enrollments: JSON.parse(JSON.stringify(enrollments)),
};

// Export the SAME object ALWAYS
export default db;
