const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");

const app = require("express")();

admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyBmaclgIacb_skoQnxdua-kG9bq2NNlWeQ",
  authDomain: "root-path-project.firebaseapp.com",
  databaseURL: "https://root-path-project.firebaseio.com",
  projectId: "root-path-project",
  storageBucket: "root-path-project.appspot.com",
  messagingSenderId: "74706554388",
  appId: "1:74706554388:web:8f256064c1a345c62a6101",
};
firebase.initializeApp(firebaseConfig);

/**
 * POST ROUTE
 */

// Get all Posts
app.get("/posts", (req, res) => {
  admin
    .firestore()
    .collection("posts")
    .orderBy("createdAt", "desc")
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
  let createdAt = new Date().toISOString();
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

/**
 * SIGNUP ROUTE
 */

app.post("/signup", (req, res) => {
  const { email, passwd, confirmPasswd, shortName } = req.body;
  const newUser = {
    email,
    passwd,
    confirmPasswd,
    shortName,
  };

  // TODO: validate data

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.passwd)
    .then((user) => {
      return res.status(201).json({
        message: `User ${user.user.email} has been registered successfully!`,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
