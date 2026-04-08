import express from "express";
import { getAllUsers, getUserById } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:userId", getUserById);

export default router;
