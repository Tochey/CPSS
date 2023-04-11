export interface Student {
    userId: string
    email: string
    name: string
    ROLE: "STUDENT" | "ADMIN"
    currClass: string
    is_520_student: boolean
    is_graduated: boolean
    student_id: string //ssu's student id
    has_uploaded_capstone: boolean
}
