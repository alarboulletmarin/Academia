import Assignment from "../models/Assignment.js";
import Subject from "../models/Subject.js";
import Professor from "../models/Professor.js";
import Group from "../models/Group.js";
import mongoose from "mongoose";
import Student from "../models/Student.js";

/**
 * Creates a new assignment.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The saved assignment object.
 */
export async function createAssignment(req, res) {
  let session;
  try {
    // Start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const group = await Group.findById(req.body.group)
      .populate("students")
      .lean()
      .exec();

    if (!group || group.students.length === 0) {
      console.error("Unable to find students in the given group");
      throw new Error("No students found in the given group.");
    }

    const assignments = [];

    for (const student of group.students) {
      const newAssignmentData = {
        ...req.body,
        group: group._id,
        student: student._id,
      };

      const newAssignment = new Assignment(newAssignmentData);
      await newAssignment.save({ session });

      assignments.push(newAssignment);
    }

    await session.commitTransaction();

    res.status(201).json(assignments);
  } catch (error) {
    console.error("Error saving assignment:", error);
    if (session) await session.abortTransaction();
    res.status(500).json({ message: "Error saving assignment" });
  } finally {
    if (session) await session.endSession();
  }
}

/**
 * Retrieves an assignment by ID.
 * @async
 * @function getAssignment
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the assignment to retrieve.
 * @returns {Object} The retrieved assignment.
 * @throws {Object} 404 error if assignment is not found, 500 error if there is an error retrieving the assignment.
 */
export async function getAssignment(req, res) {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate({
        path: "subject",
        populate: { path: "professor" },
      })
      .populate({
        path: "group",
        populate: { path: "promotion" },
      });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving assignment" });
  }
}

/**
 * Retrieves all assignments from the database and sends them as a JSON response.
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response has been sent.
 */
export async function getAssignments(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "dueDate",
      order = "asc",
      search = "",
      paginate = "true",
    } = req.query;

    const skip = (page - 1) * limit;
    const paginateCondition = paginate === "true";

    let sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    let searchOptions = search ? { title: new RegExp(search, "i") } : {};

    let filterOptions = { ...searchOptions };

    let subject = req.query.subject;

    if (subject) {
      let subjectDoc = await Subject.findOne({ name: req.query.subject });
      if (subjectDoc) {
        filterOptions.subject = subjectDoc._id;
      } else {
        return res.status(404).json({ message: "Subject not found" });
      }
    }

    let professorId = req.query.professor;

    if (professorId) {
      let professorDoc = await Professor.findById(professorId);
      if (professorDoc) {
        filterOptions.professor = professorDoc._id;
      } else {
        return res.status(404).json({ message: "Professor not found" });
      }
    }

    let groupId = req.query.group;

    if (groupId) {
      let groupDoc = await Group.findById(groupId);
      if (groupDoc) {
        filterOptions.group = groupDoc._id;
      } else {
        return res.status(404).json({ message: "Group not found" });
      }
    }

    let studentId = req.query.student;

    if (studentId) {
      let studentDoc = await Student.findById(studentId);
      if (studentDoc) {
        filterOptions.student = studentDoc._id;
      } else {
        return res.status(404).json({ message: "Student not found" });
      }
    }

    let dueDate = req.query.dueDate;
    if (dueDate) {
      let dueDateObj = new Date(dueDate);
      filterOptions.dueDate = {
        $gte: new Date(dueDateObj.setHours(0, 0, 0, 0)),
        $lt: new Date(dueDateObj.setHours(24, 0, 0, 0)),
      };
    }

    let start = req.query.start;
    let end = req.query.end;

    if (start && end) {
      let startDate = new Date(start).setHours(0, 0, 0, 0);
      let endDate = new Date(end).setHours(23, 59, 59, 999);

      filterOptions.dueDate = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    }

    let assignmentsQuery = Assignment.find(filterOptions)
      .populate("subject")
      .populate("professor")
      .populate("group")
      .populate("student")
      .sort(sortOptions);

    if (paginateCondition) {
      assignmentsQuery.skip(skip).limit(limit);
    }

    const assignments = await assignmentsQuery;
    const total = await Assignment.countDocuments(filterOptions);

    res.json({
      totalPages: paginateCondition ? Math.ceil(total / limit) : 1,
      totalResults: total,
      currentPage: page,
      assignments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving assignments" });
  }
}

/**
 * Updates an assignment by ID.
 * @async
 * @function updateAssignment
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the assignment to update.
 * @param {Object} req.body - The updated assignment data.
 * @returns {Object} The updated assignment.
 * @throws {Object} 404 - If the assignment is not found.
 * @throws {Object} 500 - If there is an error updating the assignment.
 */
export async function updateAssignment(req, res) {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((file) => file.path);
      assignment.attachments.push(...newAttachments);
    }

    Object.assign(assignment, req.body);

    const savedAssignment = await assignment.save();
    res.json(savedAssignment);
  } catch (error) {
    res.status(500).json({ message: "Error updating assignment" });
  }
}

/**
 * Deletes an assignment by ID.
 * @async
 * @function deleteAssignment
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the assignment to delete.
 * @returns {Object} The response object with a message indicating success or failure.
 */
export async function deleteAssignment(req, res) {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting assignment" });
  }
}

/**
 * Generates assignments based on the given number.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export async function generateAssignments(req, res) {
  const numAssignments = req.body.numAssignments;

  // We will keep students as well now because we need to add a student in each assignment as per new schema
  const subjects = await Subject.find();
  const groups = await Group.find();
  const professors = await Professor.find();
  const students = await Student.find();

  if (
    subjects.length === 0 ||
    groups.length === 0 ||
    professors.length === 0 ||
    students.length === 0
  ) {
    console.error(
      `Error creating assignments: No sufficient data to generate assignments`,
    );
    res
      .status(500)
      .json({ message: "No sufficient data to generate assignments" });
    return;
  }

  // start the session
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (let i = 0; i < numAssignments; i++) {
      const assignment = {
        title: `Devoir ${i + 1}`,
        description: `Description du devoir ${i + 1}`,
        dueDate: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
        subject: subjects[getRandomInt(subjects.length)]._id,
        group: groups[getRandomInt(groups.length)]._id,
        professor: professors[getRandomInt(professors.length)]._id,
        student: students[getRandomInt(students.length)]._id,
        isSubmitted: false,
        remarks: `Remarques pour le devoir ${i + 1}`,
        grade: null,
        submittedAt: null,
      };

      await new Assignment(assignment).save({
        session,
      });
    }

    await session.commitTransaction();
    res.json({
      message: `${numAssignments} assignments created successfully!`,
    });
  } catch (error) {
    console.error(`Error creating assignments: ${error}`);
    await session.abortTransaction();
    res.status(500).json({ message: "Error creating assignments" });
  } finally {
    await session.endSession();
  }
}
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
