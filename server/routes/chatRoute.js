import express from "express";
import { getAllChats, translate } from "../controller/chatController.js";

const router = express.Router();

router.post("/newChat", translate);
router.get("/getAllChats", getAllChats);

export default router;
