import dynamoosee from "dynamoose"
dynamoosee.aws.ddb.local()
const schema = new dynamoosee.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    {
        saveUnknown: false,
        timestamps: true,
    }
)

const student = dynamoosee.model("student", schema)
const Table = new dynamoosee.Table("student", [student])
export { student as studentModel }
