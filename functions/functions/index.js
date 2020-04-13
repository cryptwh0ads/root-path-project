const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");

const app = require("express")();

admin.initializeApp();

const { firebaseConfig } = require("./firebaseConfig");

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

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

app.post("/signup", (req, res) => {
  const { email, passwd, confirmPasswd, shortName } = req.body;
  const newUser = {
    email,
    passwd,
    confirmPasswd,
    shortName,
  };

  let errors = {};
  // Validate email
  if (isEmpty(newUser.email)) {
    errors.email = "Email must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }
  // Validate pass
  if (isEmpty(newUser.passwd)) errors.passwd = "Must not be empty";
  if (newUser.passwd !== newUser.confirmPasswd)
    errors.confirmPasswd = "Passwords must match";
  // Validate short name
  if (isEmpty(newUser.shortName)) errors.shortName = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.shortName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
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
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        shortName: newUser.shortName,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };

      return db.doc(`/users/${newUser.shortName}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
