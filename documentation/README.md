# Root Path Prototype API

This API was written in NodeJS (Firebase).

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

#### Get posts

`GET /api/posts`: gets all posts.

#### Get a post detail

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

#### Upload profile image

`POST /api/user/image`: update profile picture. (Need auth)

#### Body example

```form-data
    The API expect to send a file's key called 'image'
```

> **Note**: The endpoint expect a image file type, and reject all other file type.

#### Update User's Bio

`POST /api/user`: update profile bio. (Need auth)

#### Body example

```json
    {
        "bio": "Some bio here",
        "website": "www.your-website.com",
        "location": "Sao Paulo - Brazil",
    }
```

> **Note**: You don't need to add 'http', but if your website have SSL (https), add it.

#### Get User authenticated info

`Get /api/user`: get authenticated user's info. (Need auth)

> **Note**: This route, don't need a body.
