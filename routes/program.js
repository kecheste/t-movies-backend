const express = require("express");
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  const programs = await prisma.program.findMany();
  res.json(programs);
});

router.post("/", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  const {
    title,
    duration,
    description,
    channelId,
    typeId,
    categoryId,
    videoUrl,
  } = req.body;
  const program = await prisma.program.create({
    data: {
      title,
      duration,
      description,
      channelId,
      typeId,
      categoryId,
      videoUrl,
      status: "active",
    },
  });
  const updatedCounts = await fetchCounts();
  req.io.emit("updatedData", updatedCounts);
  res.json(program);
});

const fetchCounts = async () => {
  const userCount = await prisma.user.count();
  const channelCount = await prisma.channel.count();
  const programCount = await prisma.program.count();

  return { userCount, channelCount, programCount };
};

module.exports = router;
