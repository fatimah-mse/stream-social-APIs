# Social Media API

This is a RESTful API for a basic social media platform built with Node.js with express. It supports authentication, user management, posts, comments, and likes.

## 🛡️ Authentication

| Method | URL              | Action         |
|--------|------------------|----------------|
| POST   | /api/auth/signup | Sign up        |
| POST   | /api/auth/login  | Log in         |
| POST   | /api/auth/logout | Log out        |

---

## 👤 User Management

| Method | URL            | Action                |
|--------|----------------|-----------------------|
| GET    | /api/users/me  | Get user information  |
| PUT    | /api/users/me  | Update user profile   |
| DELETE | /api/users/me  | Delete user account   |

> ⚠️ Note: When a user is deleted, all their posts and comments must also be removed.

---

## 📝 Posts and Comments

| Method | URL                        | Action                             |
|--------|----------------------------|------------------------------------|
| POST   | /api/posts                 | Create a post                      |
| PUT    | /api/posts/:id            | Edit a post                        |
| DELETE | /api/posts/:id            | Delete a post                      |
| GET    | /api/posts/me             | Get user's own posts               |
| GET    | /api/posts                | Get all posts *(with pagination)*  |
| GET    | /api/posts/:id            | Get post details                   |
| POST   | /api/comments             | Add a comment to a post            |
| GET    | /api/comments/:postId     | Get comments of a post             |
| DELETE | /api/comments/:id         | Delete a comment                   |
| POST   | /api/likes/:postId        | Like a post                        |
| DELETE | /api/likes/:postId        | Remove like from a post           |
| DELETE | /api/posts                | Delete all user's posts            |

---

## 🧹 Full Reset

| Method | URL         | Action                                                  |
|--------|-------------|---------------------------------------------------------|
| PUT    | /api/reset  | Delete all posts & comments for user + clear profile   |

> ⚠️ Note: When editing or deleting (a post or a comment), ensure the action is performed by the owner by comparing `authorId` from the resource with the user ID extracted from the token.
>
> ⚠️ Note: When deleting a post, all associated comments must be deleted as well.

---

## ✅ Execution Tips

- Test all APIs via **POSTMAN** before submission.
- Keep file structure clean and organized.
- Use **middlewares** and **helpers** efficiently.
- Use **express-validator** for validation processes.
- Implement proper comments for each API and middleware.

---