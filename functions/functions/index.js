const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");

const app = require("express")();

admin.initializeApp();

const firebaseConfig = require("./firebaseConfig");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

/**
 * POST ROUTE
 */

// Get all Posts
app.get("/posts", (req, res) => {
  db.collection("posts")
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

  db.collection("posts")
    .add(newPost)
    .then((data) => {
      res.json({ message: `Post ${data.id} created successfully!` });
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
  db.doc(`/users/${newUser.shortName}`)
    .get()
    .then((data) => {
      if (data.exists) {
        return res
          .status(400)
          .json({ error: "This shortName is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.passwd);
      }
    })
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
