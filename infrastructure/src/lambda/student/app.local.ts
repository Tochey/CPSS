const { devConnect } = require("./app")
const studentApp = require("./app")
const PORT = 8080
studentApp.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`)
})

devConnect("dev").then((e: string) => {
    console.log(e)
})
