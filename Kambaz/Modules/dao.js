import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    db.modules = [...db.modules, newModule];
    return newModule;
  }

  function findModulesForCourse(courseId) {
    return db.modules.filter((m) => m.course === courseId);
  }

  function deleteModule(moduleId) {
    const { modules } = db;
    db.modules = modules.filter((m) => m._id !== moduleId);
    return { status: "ok" };
  }

  function updateModule(moduleId, moduleUpdates) {
    const module = db.modules.find((m) => m._id === moduleId);
    if (!module) return null;
    Object.assign(module, moduleUpdates);
    return module;
  }

  return {
    createModule,
    findModulesForCourse,
    deleteModule,
    updateModule,
  };
}
