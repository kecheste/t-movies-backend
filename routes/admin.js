const express = require("express");
const router = express.Router({ mergeParams: true });
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  const { phone, password } = req.body;
  const phoneExists = phone === process.env.ADMIN_USER;

  if (phoneExists) {
    const passOk = password === process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    if (passOk) {
      const token = jwt.sign(
        { id: 187367874, phone: process.env.ADMIN_USER },
        jwtSecret,
        { expiresIn: "24h" }
      );
      res.json({ token: token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } else {
    res.status(404).json("User not found");
  }
});

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the admin panel" });
});

module.exports = router;
