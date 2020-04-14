const { db, admin } = require("../utils/");

const { firebaseConfig } = require("../utils/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const {
  validateSignUp,
  validateLogin,
  reduceUserBio,
} = require("../utils/validators");

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

  const noImage = "no-image.png";

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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`,
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

exports.uploadImage = (req, res) => {
  if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
    return res.status(400).json({ error: "Wrong file type submitted" });
  }

  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  let imageFileName;
  let imageToBeUploaded = {};

  const busboy = new BusBoy({ headers: req.headers });

  busboy.on("file", (fieldname, file, filename, enconding, mimetype) => {
    // image.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.random() * 10000000000}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.shortName}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.addUserBio = (req, res) => {
  let userBio = reduceUserBio(req.body);

  db.doc(`/users/${req.user.shortName}`)
    .update({ userBio })
    .then(() => {
      return res.json({ message: "User bio added with successfully!" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
