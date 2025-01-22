import express from "express";

import * as dotenv from "dotenv";

import { createNewUser, getAllUser } from "../controller/userController.js";

const router = express.Router();

router.get("/allUser", getAllUser);
router.post("/newUser", createNewUser);

export default router;
