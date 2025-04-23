
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

process.env.MONGODB_URI = `mongodb+srv://db_user:${password}@fso3.shr4q91.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=FSO3`
const person = await import('./app/models/person.js')

if (!name) {
    console.log("phonebook:")
    person.Person.find({}).then(persons => {
        for (let x of persons) {
            console.log(x.name, x.number)
        }
        person.mongoose.connection.close()
    })
} else {
    person.Person.create({name, number}).then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        person.mongoose.connection.close()
    })
}



