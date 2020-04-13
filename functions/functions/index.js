const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();
const app = express();

// Get all Posts
app.get("/posts", (req, res) => {
  admin
    .firestore()
    .collection("posts")
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((dataItem) => {
        posts.push(dataItem.data());
      });
      return res.status(201).json(posts);
    })
    .catch((err) => console.error(err));
});

// Create a new Post
app.post("/post", (req, res) => {
  const { bodyMessage, shortUser } = req.body;
  let createdAt = admin.firestore.Timestamp.fromDate(new Date());
  const newPost = {
    shortUser,
    bodyMessage,
    createdAt,
  };

  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then((data) => {
      res.json({ message: `Document ${data.id} created successfully!` });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong!" });
      console.log(err);
    });
});

exports.api = functions.https.onRequest(app);
