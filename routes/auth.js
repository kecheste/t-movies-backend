const router = require("express").Router({ mergeParams: true });
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/login/failed", (req, res) => {
  res.status(401).json({ error: true, message: "Login failed" });
});

router.get("/login/success", async (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "User has successfully authenticated",
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: "User failed to authenticate",
    });
  }
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  async (req, res) => {
    const updatedCounts = await fetchCounts();
    req.io.emit("updatedData", updatedCounts);
    res.redirect(process.env.FRONT_URL);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(`${process.env.FRONT_URL}/login`);
});

const fetchCounts = async () => {
  const userCount = await prisma.user.count();
  const channelCount = await prisma.channel.count();
  const programCount = await prisma.program.count();

  return { userCount, channelCount, programCount };
};

module.exports = router;
