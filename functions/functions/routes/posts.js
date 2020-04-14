const { db } = require("../utils/");

exports.getPosts = (req, res) => {
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
};

exports.createPost = (req, res) => {
  const { bodyMessage } = req.body;
  const { shortName } = req.user;

  let createdAt = new Date().toISOString();

  if (req.body.bodyMessage.trim() === "") {
    return res.status(400).json({ body: "Message must not be empty" });
  }

  const newPost = {
    shortName,
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
};

exports.getPost = (req, res) => {
  let postData = {};

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found!" });
      }
      postData = doc.data();
      postData.postId = doc.id;
      return db
        .collection("comments")
        .where("postId", "==", req.params.postId)
        .get();
    })
    .then((data) => {
      postData.comments = [];

      data.forEach((doc) => {
        postData.comments.push(doc.data());
      });
      return res.json(postData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
