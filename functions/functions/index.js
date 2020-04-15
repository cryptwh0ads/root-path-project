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
    return db
      .doc(`posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().shortName !== snapshot.data().shortName) {
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
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnLike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().shortName !== snapshot.data().shortName) {
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
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      let batch = db.batch();

      return db
        .collection("posts")
        .where("shortName", "==", change.before.data().shortName)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    }
  });

exports.onPostDelete = functions.firestore
  .document("/posts/{postId}")
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();

    return db
      .collection("comments")
      .where("postId", "==", postId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("postId", "==", postId);
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db.collection("notifications").where("postId", "==", postId);
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
