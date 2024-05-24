if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const configurePassport = require("./passport");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.FRONT_URL,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};

const io = new Server(server, { cors: corsOptions });

app.use(
  session({
    secret: "dhjfsefhn9yr98w73ynrv9uyrnv3wy3vrwi3uvrnwi3rvyu",
    resave: false,
    saveUninitialized: false,
  })
);

const fetchCounts = async () => {
  const userCount = await prisma.user.count();
  const channelCount = await prisma.channel.count();
  const programCount = await prisma.program.count();

  return { userCount, channelCount, programCount };
};

// SOCKET.IO LIVE UPDATE COUNTER

io.on("connection", async (socket) => {
  console.log("New client connected");

  const initialCounts = await fetchCounts();
  socket.emit("initialData", initialCounts);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const adminRoutes = require("./routes/admin");
const programRoutes = require("./routes/program");
const channelRoutes = require("./routes/channel");
const authRoutes = require("./routes/auth");
const typeRoutes = require("./routes/type");
const categoryRoutes = require("./routes/category");

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

app.use(cors(corsOptions));
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/channel", channelRoutes);
app.use("/program", programRoutes);
app.use("/category", categoryRoutes);
app.use("/type", typeRoutes);

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Listening on port 3002");
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
