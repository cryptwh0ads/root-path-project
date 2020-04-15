# Root Path Prototype API

This API was written in NodeJS (w/ Firebase).

> **Remember**: This project has been in development phase

## Endpoints

### Posts

#### Create a new post (need auth)

`POST /api/post`: creates a new post.

#### Body example

```JSON
{
    "shortName": "user",
    "bodyMessage": "some text here",
}
```

> **Remember**: The returned token must be added to the authorization params in the headers.

#### Create a new post comment (need auth)

`POST /api/post/:postId/comment`: creates a new post comment.

#### Body example

```JSON
{
    "bodyMessage": "some text here",
}
```

#### Mark notifications as read (need auth)

`POST /api/notifications`: mark notifications as read.

#### Body example

```JSON
[
    "some notification's id here",
    "some notification's id here"
]
```
> **Note**: This route only need an array with notification's id.

#### Like a post (need auth)

`GET /api/post/:postId/like`: make a liked post.

> **Note**: This route, don't need a body.

#### Unlike a post (need auth)

`GET /api/post/:postId/unlike`: make a unliked post.

> **Note**: This route, don't need a body.
> 
#### Delete a post (need auth)

`DELETE /api/post/:postId`: delete post.

> **Note**: This route, don't need a body.

#### Get posts (need auth)

`GET /api/posts`: gets all posts.

#### Get a post detail (need auth)

`GET /api/post/:postId`: get all details for a post.

### Session

#### Register new user

`POST /api/signup`: creates a new user.

#### Body example

```JSON
{
    "shortName": "user",
    "email": "some email here",
    "passwd": "some pass here",
    "confirmPasswd": "confirm pass here",
}
```

#### Login w/ user's email

`POST /api/login`: login w/ user's email to get token.

#### Body example

```JSON
{
    "email": "some email here",
    "passwd": "some pass here",
}
```

#### Upload profile image (need auth)

`POST /api/user/image`: update profile picture.

#### Body example

```form-data
    The API expect to send a file's key called 'image'
```

> **Note**: The endpoint expect a image file type, and reject all other file type.

#### Update User's Bio (need auth)

`POST /api/user`: update profile bio.

#### Body example

```json
    {
        "bio": "Some bio here",
        "website": "www.your-website.com",
        "location": "Sao Paulo - Brazil",
    }
```

> **Note**: You don't need to add 'http', but if your website have SSL (https), add it.

#### Get User authenticated info (Need auth)

`Get /api/user`: get authenticated user's info. 

> **Note**: This route, don't need a body.

#### Get Any User's info

`Get /api/user/:shortName`: get user's info.

> **Note**: This route, don't need a body, only user's shortName params.
