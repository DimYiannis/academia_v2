require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();
const path = require("path");

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// v2 is a must
// const cloudinary = require('cloudinary').v2
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// })

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//DB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const sharedpostsRouter = require("./routes/sharedpostsRoutes");
const bookmarksRouter = require("./routes/bookmarksRoutes");
const likesRouter = require('./routes/likesRoutes');

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(morgan("tiny"));

app.use(express.static(path.join(__dirname, "dist"))); 
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  cors({
    origin: ['https://academiaa.netlify.app', 'https://academia-frontend.onrender.com', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Serve the 'public/uploads' directory as static files
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
  
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.cookie('token', 'someToken', {
    path: '/',
    expires: new Date('2023-12-24T17:20:31.000Z'),
    httpOnly: true,
    secure: true, // Set to true for HTTPS connections
    sameSite: 'None', // Set to 'None' for cross-origin requests
  });
});




app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/sharedposts", sharedpostsRouter);
app.use("/api/v1/bookmarks", bookmarksRouter);
app.use("/api/v1/likes", likesRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`server is listening ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
