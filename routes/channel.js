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
  const unUpdatedchannels = [
    { name: "FOX TV", logo: "./assets/channels/fox-logo.png" },
    { name: "ABC TV", logo: "./assets/channels/abc-logo.png" },
    { name: "AMC TV", logo: "./assets/channels/amc-logo.png" },
    { name: "NBC TV", logo: "./assets/channels/nbc-logo.png" },
    { name: "HBO", logo: "./assets/channels/hbo-logo.png" },
    { name: "City TV", logo: "./assets/channels/nbc-logo.png" },
    { name: "ESPN", logo: "./assets/channels/espn-logo.png" },
    { name: "Disney", logo: "./assets/channels/disney-logo.png" },
    { name: "CNN", logo: "./assets/channels/cnn-logo.png" },
  ];
  const dbChannels = await prisma.channel.findMany();
  const channels = dbChannels
    .map((dbChannel) => {
      const matchingChannel = unUpdatedchannels.find(
        (channel) => channel.name === dbChannel.name
      );
      if (matchingChannel) {
        return { id: dbChannel.id, ...matchingChannel };
      }
      return null;
    })
    .filter((channel) => channel !== null);
  res.json(channels);
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
  const { name } = req.body;
  const channel = await prisma.channel.create({
    data: {
      name,
      status: "active",
    },
  });
  const updatedCounts = await fetchCounts();
  req.io.emit("updatedData", updatedCounts);
  res.json(channel);
});

const fetchCounts = async () => {
  const userCount = await prisma.user.count();
  const channelCount = await prisma.channel.count();
  const programCount = await prisma.program.count();

  return { userCount, channelCount, programCount };
};

module.exports = router;
