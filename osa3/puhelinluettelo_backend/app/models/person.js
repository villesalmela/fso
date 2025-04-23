import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'name is required']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2}-\d{5,}|\d{3}-\d{4,}/.test(v)
      },
      message: props => `${props.value} is not a valid number`
    },
    required: [true, 'number is required']
  },
})

const Person =  mongoose.model.Person || mongoose.model('Person', personSchema, 'henkilöt')
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export { Person, mongoose }