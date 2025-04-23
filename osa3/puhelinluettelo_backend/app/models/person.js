import mongoose from 'mongoose'
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: String,
})

const Person =  mongoose.model.Person || mongoose.model('Person', personSchema, "henkilöt")
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export {Person, mongoose}