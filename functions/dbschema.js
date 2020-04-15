/**
 * The DB structure
 */

let db = {
  posts: [
    {
      shortName: "user",
      bodyMessage: "Post body here",
      createdAt: "2020-04-13T17:00:00.018Z",
      likeCount: 1,
      commentCount: 2,
    },
  ],
  users: [
    {
      userID: "user id here",
      email: "user email here",
      shortName: "nick name",
      createdAt: "timestamp",
      imageUrl: "pic profile",
      bio: "Bio description",
      website: "website url",
      location: "from here",
    },
  ],
  notifications: [
    {
      recipient: "recipient's shortName",
      sender: "sender's shortName",
      createdAt: "2020-04-14T23:09:42.128Z",
      postId: "the postId",
      type: "like / comment",
      read: "true or false",
      notificationId: "notificationId",
    },
  ],
  likes: [
    {
      userImage: "user's image profile ",
      bodyMessage: "comment here",
      shortName: "user's shortName",
      likeCount: 0,
      commentCount: 0,
      createdAt: "2020-04-14T23:09:42.128Z",
      postId: "the postId",
    },
  ],
  comments: [
    {
      bodyMessage: "comment here",
      userImage: "user's image profile ",
      postId: "the postId",
      createdAt: "2020-04-14T21:38:22.725Z",
      shortName: "the user's shortName",
    },
  ],
};
