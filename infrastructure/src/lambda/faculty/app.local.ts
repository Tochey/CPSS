
namespace FacultyLocalApp {
    const facultyApp = require('./app')
    const SEVER_PORT = 8080

    facultyApp.listen(SEVER_PORT, () => {
        console.log(`Server is running on port ${SEVER_PORT}`)
    })
}

