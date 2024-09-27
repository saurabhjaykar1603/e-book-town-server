## RESTful API with JWT authentication, PDF file handling via Cloudinary, and full CRUD operations for book management:

### Node.js With TypeScript , Express for Creating Servers Routes , CLoudinary for Store PDF and Images

```markdown
# E-Book Town API

This API allows users to manage books, with secure user authentication using JWT. It handles uploading PDF files and cover images to Cloudinary. Below are the available endpoints and their usage.

## Base URL

```
https://e-book-town-server-1.onrender.com
```

## Authentication

This API uses JWT for secure access. To perform certain actions like creating, updating, or deleting a book, users must be authenticated.

### Register a new User

```
POST /auth/register
```

#### Request Body
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### Response

```json
{
  "accessToken": "string",
  "message": "User Created Successfully"
}
```

### Login User

```
POST /auth/login
```

#### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

#### Response

```json
{
  "accessToken": "string",
  "message": "User logged in successfully"
}
```

### JWT Authentication

For routes that require authentication, include the token in the `Authorization` header.

```
Authorization: Bearer <token>
```

## Book Management Endpoints

### 1. Create a Book

```
POST /books
```

#### Request (Form Data)
- `title`: string (required)
- `genre`: string (required)
- `description`: string (required)
- `coverImage`: image file (required)
- `file`: PDF file (required)

#### Response

```json
{
  "message": "Book created successfully",
  "data": "<Book ID>"
}
```

### 2. Update a Book

```
PUT /books/:bookId
```

#### Request (Form Data)
- `title`: string (required)
- `genre`: string (required)
- `description`: string (required)
- Optionally: `coverImage` (image file) and/or `file` (PDF file)

#### Response

```json
{
  "status": "ok",
  "data": {
    "_id": "<Book ID>",
    "title": "string",
    "genre": "string",
    "description": "string",
    "coverImage": "string",
    "file": "string"
  }
}
```

### 3. Get All Books

```
GET /books
```

#### Response

```json
{
  "status": "ok",
  "data": [
    {
      "_id": "string",
      "title": "string",
      "genre": "string",
      "description": "string",
      "coverImage": "string",
      "file": "string",
      "author": {
        "_id": "string",
        "name": "string"
      }
    },
    ...
  ]
}
```

### 4. Get a Single Book

```
GET /books/:id
```

#### Response

```json
{
  "status": "ok",
  "data": {
    "_id": "string",
    "title": "string",
    "genre": "string",
    "description": "string",
    "coverImage": "string",
    "file": "string",
    "author": {
      "_id": "string",
      "name": "string"
    }
  }
}
```

### 5. Delete a Book

```
DELETE /books/:id
```

#### Response

```json
{
  "status": "ok",
  "message": "Book deleted successfully"
}
```

## Error Handling

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error message"
}
```

- 400: Invalid request data.
- 401: Unauthorized, invalid or missing JWT.
- 404: Resource not found.
- 500: Internal server error.

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose)
- **Cloudinary** for image and PDF storage
- **JWT** for user authentication
- **Multer** for file uploads
- **bcrypt** for password hashing

## Setup

To set up this API locally:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Add your Cloudinary and JWT configuration in `.env`.
4. Run the server with `npm run dev`.

---

This API provides robust functionality for managing books with secure access. Please ensure that all API calls requiring authentication include the JWT token.
```

This markdown covers the essential functionality of your RESTful API, including authentication, book management, error handling, and the technologies used. Let me know if you need further customizations!
