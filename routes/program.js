const express = require("express");
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const programs = await prisma.program.findMany();
  res.json(programs);
});

router.post("/", async (req, res) => {
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
