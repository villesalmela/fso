import { Schema, model } from 'mongoose'

const userSchema = Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        minlength: [3, 'username must be at least 3 characters long'],
        unique: [true, 'username must be unique']
    },
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [3, 'name must be at least 3 characters long']
    },
    passwordHash: {
        type: String,
        required: [true, 'passwordHash is required'],
        minlength: 3
    },
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blog',
            required: true
        }
    ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = model('User', userSchema, 'käyttäjät')

export { User }