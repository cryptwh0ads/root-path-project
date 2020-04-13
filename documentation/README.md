# Root Path Prototype API

This API was written in NodeJS (Firebase).

> **Remember**: This project has been in development phase

## Endpoints

### Posts

#### Create a new post

`POST /api/post`: creates a new post.

#### Body example

```JSON
{
    "shortUser": "user",
    "bodyMessage": "some text here",
}
```

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

`POST /api/login`: login w/ user's email.

#### Body example

```JSON
{
    "email": "some email here",
    "passwd": "some pass here",
}
```
