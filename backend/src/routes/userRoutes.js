import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  loginUser,
  updateUser
} from "../controllers/userController.js";

const router = express.Router();

// Specific routes first
router.post("/register", createUser);     // Register
router.post("/login", loginUser);  // Login
router.get("/", getUsers);        // Get all
// Parameterized routes last
router.patch("/:id", updateUser);  // Update user
router.get("/:id", getUser);      // Get one

export default router;
