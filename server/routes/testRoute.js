import express from "express";

const router = express.Router();

router.get("/test", (request, response) => {
  console.log("this is just controller");
  response.send({
    message: "this is a test route",
  });
});

router.post("/test", (req, res) => {
  res.send({ message: "this is a test Post" });
});



export default router;
