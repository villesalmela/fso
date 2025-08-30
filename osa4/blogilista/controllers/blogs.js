import { Router } from "express";
import { Blog } from '../models/blog.js'
import { User } from '../models/user.js'
import { userExtractor } from '../utils/middleware.js'

const blogsRouter = new Router()

const userOwnsBlog = (user_id, blog_id) => {
  return Blog.findById(blog_id).then(blog => {
    if (blog) {
      return blog.user.toString() === user_id.toString()
    } else {
      return false
    }
  })
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
  })

  blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1, id: 1})
    if (blog) {
      response.json(blog)
    } else {
      response.sendStatus(404)
    }
  })

blogsRouter.post('/', userExtractor, async (request, response) => {
    if (typeof request.body.likes === "undefined") {
      request.body.likes = 0
    }
    if (typeof request.body.title === "undefined" || typeof request.body.url === "undefined") {
      response.sendStatus(400)
    }
    const newBlog = {...request.body, user: request.user.id}
    const blog = new Blog(newBlog)
    const result = await blog.save()
    const user = await User.findById(request.user.id)
    user.blogs.push(result.id)
    await user.save()
    response.status(201).json(result)
  })

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (!await userOwnsBlog(request.user.id, request.params.id)) {
    return response.status(401).json({ error: 'only the creator can delete a blog' })
  }
  const ret = await Blog.findByIdAndDelete(request.params.id)
  if (ret) {
    response.sendStatus(204)
  } else {
    response.sendStatus(500)
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (!await userOwnsBlog(request.user.id, request.params.id)) {
    return response.status(401).json({ error: 'only the creator can modify a blog' })
  }
  const ret = await Blog.findByIdAndUpdate(request.params.id, request.body)
  if (ret) {
    response.sendStatus(204)
  } else {
    response.sendStatus(404)
  }

})

export { blogsRouter }
