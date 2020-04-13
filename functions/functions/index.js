const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Get all Posts
exports.getPosts = functions.https.onRequest((req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }
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
exports.createPost = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
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
