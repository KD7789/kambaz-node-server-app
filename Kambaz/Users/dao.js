import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function UsersDao() {

  const createUser = (user) => {} 

  const findAllUsers = () => model.find();

  const findUserById = (userId) => model.findById(userId);

  const findUsersByRole = (role) => model.find({ role: role }); 

  const findUserByUsername = (username) =>  model.findOne({ username: username });

  const findUserByCredentials = (username, password) =>  model.findOne({ username, password });

  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };  

  const updateUser = (userId, user) =>  model.updateOne({ _id: userId }, { $set: user });

  const deleteUser = (userId) => model.deleteOne({ _id: userId });

  return { createUser, findAllUsers, findUserById, findUsersByRole, findUsersByPartialName,
    findUserByUsername, findUserByCredentials, updateUser, deleteUser };
}