import Student from "../models/Student.js";

/**
 * Creates a new student in the database.
 * @async
 * @function createStudent
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The saved student object.
 * @throws {Object} Error saving student.
 */
export async function createStudent(req, res) {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.json(savedStudent);
    } catch (error) {
        res.status(500).json({message: "Error saving student"});
    }
}

/**
 * Retrieves a student by ID.
 * @async
 * @function getStudent
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the student to retrieve.
 * @returns {Object} The student object.
 * @throws {Object} 404 error if student is not found, 500 error if there's an error retrieving the student.
 */
export async function getStudent(req, res) {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({message: "Student not found"});
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({message: "Error retrieving student"});
    }
}

/**
 * Retrieves all students from the database
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Returns a JSON object containing all students
 * @throws {Object} - Returns a 500 status code with an error message if there was an error retrieving the students
 */
export async function getStudents(req, res) {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({message: "Error retrieving students"});
    }
}

/**
 * Updates a student by ID.
 * @async
 * @function updateStudent
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The updated student object.
 * @throws {Object} 404 error if student is not found, 500 error if there's an error updating the student.
 */
export async function updateStudent(req, res) {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({message: "Student not found"});
        }
        Object.assign(student, req.body);
        const savedStudent = await student.save();
        res.json(savedStudent);
    } catch (error) {
        res.status(500).json({message: "Error updating student"});
    }
}

/**
 * Deletes a student from the database.
 * @async
 * @function deleteStudent
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with a message indicating success or failure.
 */
export async function deleteStudent(req, res) {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({message: "Student not found"});
        }
        res.json({message: "Student deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error deleting student"});
    }
}
