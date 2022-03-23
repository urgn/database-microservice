# database-microservice

Blog enigne database microservice.

## Service

Run service:
```
npm start
```

Run unit tests:
```
docker-compose up -d
npm t
```

## REST Api

### Blogs

To read all blogs `http GET`:
```
/blogs
```
Example response:
```JSON
[
    {
        "name": "Blog Name",
        "slug": "blog_slug",
        "posts": []
    },
    {
        "name": "Second Blog",
        "slug": "2nd",
        "posts": []
    }
]
```
---

To read all blogs `http GET` with child posts:

```
/blogs?showPosts
```
Example response:
```JSON
[
    {
        "name": "Blog Name",
        "slug": "blog_slug",
        "posts": [
            {
                "id": "623b3996f0b9d50eb27f7253",
                "title": "Welcome post",
                "viewCount": 123,
                "content": "Lorem ipsum"
            }, {
                "id": "623b3996f0b9d50eb27f7254",
                "title": "Another Post",
                "viewCount": 456,
                "content": "Foo Bar"
            }
        ]
    }, {
        "name": "Second Blog",
        "slug": "2nd",
        "posts": [
            {
                "id": "623b3996f0b9d50eb27f7255",
                "title": "Post of different blog",
                "viewCount": -1,
                "content": "Just in case"
            }
        ]
    }
]
```
---
To create blog `http POST` to:
```
/blogs
```
With JSON encoded body:
```JSON
{
    "name": "Blog with posts",
    "slug": "some_slug",
    "posts": [
        {
            "title": "internal post one",
            "content": "hello there",
            "viewCount": 111
        },
        {
            "title": "internal post two",
            "content": "hello there again",
            "viewCount": 222
        }
    ]
}
```
---
To update blog `http PUT`:
```
/blogs/:slug
```
With JSON encoded body:
```JSON
{
    "name": "Updated Name",
    "slug": "updated_slug",
}
```
---
To delete blog `http DELETE`:
```
/blogs/:slug
```

### Posts
To view all posts of the blog `http GET`:
```
/blogs/:slug/posts
```
Example response:
```JSON
[
    {
        "id": "623b3996f0b9d50eb27f7253",
        "title": "Welcome post",
        "viewCount": 123,
        "content": "Lorem ipsum"
    }, {
        "id": "623b3996f0b9d50eb27f7254",
        "title": "Another Post",
        "viewCount": 456,
        "content": "Foo Bar"
    }
]

```
---
To view single post `http GET`:

```
/blogs/:slug/posts/:postId
```
Example response:
```JSON
{
    "id": "623b3996f0b9d50eb27f7254",
    "title": "Another Post",
    "viewCount": 456,
    "content": "Foo Bar"
}
```
---

To create post related to a blog `http POST`:
```
/blogs/:slug/posts
```
With JSON encoded body:
```JSON
{
    "title": "New post",
    "content": "Hello world!",
    "viewCount": 0
}
```
---
To update post related to a blog `http PUT`:
```
/blogs/:slug/posts/:postId
```
With JSON encoded body:
```JSON
{
    "title": "Updated post",
    "content": "Brand new content",
    "viewCount": 123
}
```
---
To delete post `http DELETE`:
```
/blogs/:slug/posts/:postId
```