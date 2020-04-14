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

#### Get posts

`GET /api/posts`: gets all posts.

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

> **Note**: The endpoint expect a image file type, and reject all other file type.
