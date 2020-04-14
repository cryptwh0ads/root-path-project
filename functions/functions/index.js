const functions = require("firebase-functions");

const app = require("express")();

const { BAuth } = require("./utils/auth");
const { getPosts, createPost, getPost } = require("./routes/posts");
const {
  signUp,
  login,
  uploadImage,
  addUserBio,
  getAuthUser,
} = require("./routes/users");

/**
 * POSTS ROUTE
 */
// TODO: Create 'delete', 'like', 'unlike' and 'comment' routes to post

// Get all Posts
app.get("/posts", getPosts);
// Create a new Post
app.post("/post", BAuth, createPost);
app.get("/post/:postId", getPost);

/**
 * SESSION ROUTE
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

exports.api = functions.https.onRequest(app);
