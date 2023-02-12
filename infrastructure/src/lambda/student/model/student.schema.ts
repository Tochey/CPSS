const dynamoosee = require("dynamoose")
const schema = new dynamoosee.Schema(
    {
        userId: String,
        email: String,
        age: Number,
    },
    {
        saveUnknown: false,
        timestamps: true,
    }
)
const Cat = dynamoosee.model("Cat", schema)
const Table = new dynamoosee.Table("student", [Cat])
module.exports = Cat
