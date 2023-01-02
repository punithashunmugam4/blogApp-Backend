const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./routes/blog-routes");
const router = require("./routes/user-routes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user", router); // if we have const portal in url we can give as app.use('/api/user',router) whatever we give path will be added to given path
app.use("/api/blog", blogRouter);

mongoose
  .connect(
    "mongodb+srv://shunmugam:4yVPcWevT2ihxVMb@cluster0.mgwnvnw.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() =>
    app.listen("https://ps-blogappserver.onrender.com", () => {
      console.log("server listening to port 5000");
    })
  )
  .then(() => console.log("mongoose connnected to db"))
  .catch((err) => console.log(err));

// mongodb+srv://shunmugam:<password>@cluster0.mgwnvnw.mongodb.net/?retryWrites=true&w=majority
// shunmugam 4yVPcWevT2ihxVMb
