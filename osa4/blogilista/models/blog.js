import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 1,
    required: [true, 'title is required']
  },
  author: {
    type: String,
    minLength: 1,
    required: [true, 'author is required']
  },
  url: {
    type: String,
    minLength: 1,
    required: [true, 'url is required']
  },
  likes: {
    type: Number,
    min: 0,
    required: [true, 'likes is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required']
  }
})

const Blog =  mongoose.model.blog || mongoose.model('Blog', blogSchema, 'blogit')
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export { Blog, mongoose }