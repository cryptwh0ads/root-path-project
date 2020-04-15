const functions = require("firebase-functions");
const { db } = require("./utils/index");
const app = require("express")();

const { BAuth } = require("./utils/auth");
const {
  getPosts,
  createPost,
  getPost,
  commentPost,
  likePost,
  unlikePost,
  deletePost,
} = require("./routes/posts");
const {
  signUp,
  login,
  uploadImage,
  addUserBio,
  getAuthUser,
  getAnotherUserBio,
  markNotificationAsRead,
} = require("./routes/users");

/**
 * POSTS ROUTE
 */

// Get all Posts
app.get("/posts", getPosts);
// Create a new Post
app.post("/post", BAuth, createPost);
app.get("/post/:postId", getPost);
app.post("/post/:postId/comment", BAuth, commentPost);
app.get("/post/:postId/like", BAuth, likePost);
app.get("/post/:postId/unlike", BAuth, unlikePost);
app.delete("/post/:postId", BAuth, deletePost);

/**
 * SESSION / USER ROUTE
 */

app.get("/user", BAuth, getAuthUser);
// Register user
app.post("/signup", signUp);
// Login route
app.post("/login", login);
// Upload user image file
app.post("/user/image", BAuth, uploadImage);
// Update user's bio
app.post("/user", BAuth, addUserBio);
// Get another user's bio
app.get("/user/:shortName", getAnotherUserBio);
// Mark the notifications as read
app.post("/notifications", BAuth, markNotificationAsRead);
exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().shortName,
            sender: snapshot.data().shortName,
            type: "like",
            read: false,
            postId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnLike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    db.doc(`posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().shortName,
            sender: snapshot.data().shortName,
            type: "comment",
            read: false,
            postId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
