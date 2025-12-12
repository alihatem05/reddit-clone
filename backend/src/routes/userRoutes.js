import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  loginUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);        // Get all
router.get("/:id", getUser);      // Get one
router.post("/register", createUser);     // Register
router.post("/login", loginUser);  // Login

export default router;
