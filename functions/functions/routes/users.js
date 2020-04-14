const { db } = require("../utils/");

const { firebaseConfig } = require("../utils/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const { validateSignUp, validateLogin } = require("../utils/validators");

exports.signUp = (req, res) => {
  const { email, passwd, confirmPasswd, shortName } = req.body;
  const newUser = {
    email,
    passwd,
    confirmPasswd,
    shortName,
  };

  const { isValid, errors } = validateSignUp(newUser);

  if (!isValid) return res.status(400).json(errors);

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
};

exports.login = (req, res) => {
  const { email, passwd } = req.body;

  const user = {
    email,
    passwd,
  };

  const { isValid, errors } = validateLogin(user);

  if (!isValid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.passwd)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
