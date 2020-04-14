const functions = require("firebase-functions");

const app = require("express")();

const { BAuth } = require("./utils/auth");
const { getPosts, createPost } = require("./routes/posts");
const { signUp, login, uploadImage, addUserBio } = require("./routes/users");

/**
 * POSTS ROUTE
 */

// Get all Posts
app.get("/posts", getPosts);
// Create a new Post
app.post("/post", BAuth, createPost);

/**
 * SESSION ROUTE
 */

// Register user
app.post("/signup", signUp);
// Login route
app.post("/login", login);
// Upload user image file
app.post("/user/image", BAuth, uploadImage);
// Update user's bio
app.post("/user", BAuth, addUserBio);

exports.api = functions.https.onRequest(app);
