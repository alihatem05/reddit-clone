# Reddit Clone API Documentation

**Base URL:** `http://localhost:<PORT>/api`  
**Content-Type:** `application/json`

---

## POST /users/register

Create a new user account.

**Auth:** None

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0,
    "posts": [],
    "comments": [],
    "communities": [],
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string"
}
```

**Errors:**
```json
{ "error": "All fields must be filled!" }
```
```json
{ "error": "Incorrect email structure!" }
```
```json
{ "error": "Email already exists!" }
```
```json
{ "error": "Username already taken!" }
```

---

## POST /users/login

Authenticate a user and return a token.

**Auth:** None

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0,
    "posts": [],
    "comments": [],
    "communities": []
  },
  "token": "string"
}
```

**Errors:**
```json
{ "error": "All fields must be filled!" }
```
```json
{ "error": "User does not exist!" }
```
```json
{ "error": "Incorrect password!" }
```

---

## GET /users

Get all users.

**Auth:** None

**Request:** None

**Response:**
```json
[
  {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0,
    "posts": [],
    "comments": [],
    "communities": []
  }
]
```

**Errors:**
```json
{ "error": "string" }
```

---

## GET /users/:id

Get a specific user with all related data.

**Auth:** None

**Request:** None (id in URL path)

**Response:**
```json
{
  "_id": "string",
  "username": "string",
  "email": "string",
  "avatar": "string",
  "karma": 0,
  "posts": [],
  "comments": [],
  "upvotedPosts": [],
  "downvotedPosts": [],
  "upvotedComments": [],
  "downvotedComments": []
}
```

**Errors:**
```json
{ "error": "User not found" }
```

---

## PATCH /users/:id

Update a user's profile.

**Auth:** None

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "avatar": "string"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0
  }
}
```

**Errors:**
```json
{ "error": "Invalid user ID format" }
```
```json
{ "error": "Incorrect email structure!" }
```
```json
{ "error": "Email already exists!" }
```
```json
{ "error": "Username already taken!" }
```
```json
{ "error": "User not found" }
```

---

## GET /users/:id/comments

Get all comments by a specific user.

**Auth:** None

**Request:** None (id in URL path)

**Response:**
```json
[
  {
    "_id": "string",
    "text": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "avatar": "string"
    },
    "post": {
      "_id": "string",
      "title": "string"
    },
    "karma": 0,
    "replies": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Errors:**
```json
{ "error": "string" }
```

---

## GET /users/:id/upvoted

Get all posts upvoted by a specific user.

**Auth:** None

**Request:** None (id in URL path)

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "image": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "avatar": "string"
    },
    "community": {
      "_id": "string",
      "name": "string",
      "logo": "string"
    },
    "votes": 0,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Errors:**
```json
{ "error": "string" }
```

---

## GET /users/:id/downvoted

Get all posts downvoted by a specific user.

**Auth:** None

**Request:** None (id in URL path)

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "image": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "avatar": "string"
    },
    "community": {
      "_id": "string",
      "name": "string",
      "logo": "string"
    },
    "votes": 0,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Errors:**
```json
{ "error": "string" }
```

---

## GET /posts

Get all posts.

**Auth:** None

**Request:** None

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "image": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "avatar": "string",
      "karma": 0
    },
    "community": {
      "_id": "string",
      "name": "string",
      "description": "string",
      "logo": "string",
      "backgroundImage": "string",
      "type": "string",
      "topic": "string"
    },
    "comments": [],
    "upvoters": [],
    "downvoters": [],
    "votes": 0,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Errors:**
```json
{ "error": "Failed to fetch posts" }
```

---

## GET /posts/:id

Get a specific post with all comments.

**Auth:** None

**Request:** None (id in URL path)

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "image": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0
  },
  "community": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "logo": "string",
    "backgroundImage": "string",
    "type": "string",
    "topic": "string"
  },
  "comments": [],
  "upvoters": [],
  "downvoters": [],
  "votes": 0,
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "Post not found" }
```
```json
{ "error": "Failed to fetch post" }
```

---

## POST /posts

Create a new post.

**Auth:** None

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "image": "string",
  "user": "string",
  "community": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "image": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0
  },
  "community": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "logo": "string",
    "backgroundImage": "string",
    "type": "string",
    "topic": "string"
  },
  "comments": [],
  "upvoters": [],
  "downvoters": [],
  "votes": 0,
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "Failed to create post" }
```

---

## PUT /posts/:id

Update a post.

**Auth:** None

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "image": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "image": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0
  },
  "community": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "logo": "string",
    "backgroundImage": "string",
    "type": "string",
    "topic": "string"
  },
  "comments": [],
  "upvoters": [],
  "downvoters": [],
  "votes": 0,
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "Post not found" }
```
```json
{ "error": "Failed to update post" }
```

---

## PATCH /posts/:id/vote

Upvote, downvote, or remove vote from a post.

**Auth:** None

**Request:**
```json
{
  "delta": 1,
  "userId": "string"
}
```

Note: `delta` can be `1` (upvote), `-1` (downvote), or `0` (remove vote).

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "image": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0
  },
  "community": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "logo": "string",
    "backgroundImage": "string",
    "type": "string",
    "topic": "string"
  },
  "comments": [],
  "upvoters": [],
  "downvoters": [],
  "votes": 0,
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "userId required" }
```
```json
{ "error": "No existing vote to remove" }
```
```json
{ "error": "Post not found" }
```
```json
{ "error": "Failed to update post vote" }
```

---

## DELETE /posts/:id

Delete a post.

**Auth:** None

**Request:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "Post deleted"
}
```

**Errors:**
```json
{ "error": "userId required" }
```
```json
{ "error": "Not authorized" }
```
```json
{ "error": "Post not found" }
```
```json
{ "error": "Failed to delete post" }
```

---

## GET /comments/:postId

Get all comments for a specific post.

**Auth:** None

**Request:** None (postId in URL path)

**Response:**
```json
[
  {
    "_id": "string",
    "text": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "avatar": "string"
    },
    "post": "string",
    "karma": 0,
    "parent": null,
    "replies": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Errors:**
```json
{ "error": "Failed to fetch comments" }
```

---

## POST /comments

Create a new comment.

**Auth:** None

**Request:**
```json
{
  "text": "string",
  "user": "string",
  "post": "string",
  "parent": "string"
}
```

Note: `parent` is optional. If provided, the comment is a reply to another comment.

**Response:**
```json
{
  "_id": "string",
  "text": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0
  },
  "post": "string",
  "karma": 0,
  "parent": "string",
  "replies": [],
  "upvoters": [],
  "downvoters": [],
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "Failed to add comment" }
```

---

## PATCH /comments/:id/vote

Upvote, downvote, or remove vote from a comment.

**Auth:** None

**Request:**
```json
{
  "delta": 1,
  "userId": "string"
}
```

Note: `delta` can be `1` (upvote), `-1` (downvote), or `0` (remove vote).

**Response:**
```json
{
  "_id": "string",
  "text": "string",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "karma": 0
  },
  "post": "string",
  "karma": 0,
  "parent": "string",
  "replies": [],
  "upvoters": [],
  "downvoters": [],
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "userId required" }
```
```json
{ "error": "No existing vote to remove" }
```
```json
{ "error": "Comment not found" }
```
```json
{ "error": "Failed to update comment vote" }
```

---

## DELETE /comments/:id

Delete a comment and all its replies.

**Auth:** None

**Request:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "Comment deleted"
}
```

**Errors:**
```json
{ "error": "userId required" }
```
```json
{ "error": "Not authorized" }
```
```json
{ "error": "Comment not found" }
```
```json
{ "error": "Failed to delete comment" }
```

---

## GET /communities

Get all communities.

**Auth:** None

**Request:** None

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "logo": "string",
    "backgroundImage": "string",
    "type": "string",
    "topic": "string",
    "members": [],
    "posts": [],
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Errors:**
```json
{ "error": "Failed to fetch communities" }
```

---

## GET /communities/:id

Get a specific community.

**Auth:** None

**Request:** None (id in URL path)

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "logo": "string",
  "backgroundImage": "string",
  "type": "string",
  "topic": "string",
  "members": [],
  "posts": [],
  "createdBy": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "Community not found" }
```
```json
{ "error": "Failed to fetch community" }
```

---

## POST /communities

Create a new community.

**Auth:** None

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "logo": "string",
  "backgroundImage": "string",
  "type": "string",
  "topic": "string",
  "createdBy": "string"
}
```

Note: `type` must be one of: `"public"`, `"restricted"`, `"private"` (default: `"public"`).

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "logo": "string",
  "backgroundImage": "string",
  "type": "string",
  "topic": "string",
  "members": [],
  "posts": [],
  "createdBy": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Errors:**
```json
{ "error": "Failed to create community" }
```

---

## POST /communities/:id/join

Join a user to a community.

**Auth:** None

**Request:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "Joined community",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "communities": ["string"]
  },
  "community": {
    "_id": "string",
    "name": "string",
    "members": ["string"]
  }
}
```

**Errors:**
```json
{ "error": "User or Community not found" }
```
```json
{ "error": "Failed to join community" }
```

---

## POST /communities/:id/leave

Remove a user from a community.

**Auth:** None

**Request:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "Left community",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "communities": []
  },
  "community": {
    "_id": "string",
    "name": "string",
    "members": []
  }
}
```

**Errors:**
```json
{ "error": "User or Community not found" }
```
```json
{ "error": "Failed to leave community" }
```

---

## GET /communities/:id/posts

Get all posts in a specific community.

**Auth:** None

**Request:** None (id in URL path)

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "image": "string",
    "user": {
      "_id": "string",
      "username": "string"
    },
    "community": {
      "_id": "string",
      "name": "string"
    },
    "votes": 0,
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

**Errors:**
```json
{ "error": "Failed to fetch community posts" }
```

---

## DELETE /communities/:id

Delete a community and all associated posts and comments.

**Auth:** None

**Request:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "Community deleted successfully"
}
```

**Errors:**
```json
{ "error": "Only the creator can delete this community" }
```
```json
{ "error": "Community not found" }
```
```json
{ "error": "Failed to delete community" }
```
