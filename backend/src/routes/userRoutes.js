import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);        // Get all
router.get("/:id", getUser);      // Get one
router.post("/", createUser);     // Register
router.post("/login", loginUser);  // Login
router.put("/:id", updateUser);   // Edit profile
router.delete("/:id", deleteUser); // Remove user

export default router;
