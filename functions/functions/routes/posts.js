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
