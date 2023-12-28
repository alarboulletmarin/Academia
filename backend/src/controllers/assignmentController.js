import Assignment from "../models/Assignment.js";
import Subject from "../models/Subject.js";
import Professor from "../models/Professor.js";
import Group from "../models/Group.js";
import Submission from "../models/Submission.js";
import mongoose from "mongoose";

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
    const createdAssignment = await saveAssignment(req.body, session);
    await createSubmissions(createdAssignment, session);
    await session.commitTransaction();

    res.status(201).json(createdAssignment);
  } catch (error) {
    console.error("Error saving assignment:", error);
    if (session) await session.abortTransaction();
    res.status(500).json({ message: "Error saving assignment" });
  } finally {
    if (session) await session.endSession();
  }
}

/**
 * Save an assignment to the database.
 *
 * @param {Object} assignmentData - The assignment data to be saved.
 * @param {Object} session - The database session to use.
 * @return {Promise} - A promise that resolves to the saved assignment object.
 */
async function saveAssignment(assignmentData, session) {
  return await new Assignment(assignmentData).save({ session });
}

/**
 * Creates submissions for a given assignment in a session.
 *
 * @param {Object} createdAssignment - The created assignment object.
 * @param {Object} session - The session object.
 * @throws {Error} If the group is not found.
 * @returns {undefined}
 */
async function createSubmissions(createdAssignment, session) {
  const group = await Group.findById(createdAssignment.group).session(session);
  if (!group) throw new Error("Group not found");

  const submissionDocs = group.students.map((studentId) => ({
    student: studentId,
    assignment: createdAssignment._id,
    isSubmitted: false,
    grade: null,
    remarks: "",
  }));

  await Submission.insertMany(submissionDocs, { session });
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
 * Build the filter options based on the request query.
 * @function
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - The filter options.
 */
async function buildFilterOptions(req) {
  const { search = "", subject, professor, dueDate, start, end } = req.query;
  let searchOptions = search ? { title: new RegExp(search, "i") } : {};
  let filterOptions = { ...searchOptions };

  if (subject) {
    let subjectDoc = await Subject.findOne({ name: subject });
    if (subjectDoc) {
      filterOptions.subject = subjectDoc._id;
    }
  }

  if (professor) {
    let professorDoc = await Professor.findById(professor);
    if (professorDoc) {
      filterOptions.professor = professorDoc._id;
    }
  }

  if (dueDate) {
    filterOptions.dueDate = { ...setDateRange(dueDate) };
  }

  if (start && end) {
    filterOptions.dueDate = {
      $gte: new Date(new Date(start).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(end).setHours(23, 59, 59, 999)),
    };
  }

  return filterOptions;
}

/**
 * Set Date range for filtering.
 * @function
 * @param {String} dueDate - The due date string.
 * @returns {Object} - The date range for filtering.
 */
const setDateRange = (dueDate) => {
  let dueDateObj = new Date(dueDate);
  return {
    $gte: new Date(dueDateObj.setHours(0, 0, 0, 0)),
    $lt: new Date(dueDateObj.setHours(24, 0, 0, 0)),
  };
};

/**
 * Retrieves a list of assignments based on the given criteria.
 *
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response JSON object with the list of assignments and pagination details.
 * @throws {Error} - If there is an error retrieving the assignments.
 */
export async function getAssignments(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "dueDate",
      order = "asc",
      paginate = "true",
    } = req.query;

    const skip = paginate === "true" ? (page - 1) * limit : 0;
    const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };

    const filterOptions = await buildFilterOptions(req);

    let assignmentsQuery = Assignment.find(filterOptions)
      .populate("subject")
      .populate("professor")
      .populate("group")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const assignments = await assignmentsQuery;
    const total = await Assignment.countDocuments(filterOptions);

    res.json({
      totalPages: Math.ceil(total / limit),
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
 * Updates an assignment.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @return {Promise} A promise that resolves to the updated assignment or an error response.
 *
 * @throws {Error} If there is an error updating the assignment.
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
 * Generates assignments based on the specified number of assignments.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {number} req.body.numAssignments - The number of assignments to generate.
 *
 * @return {Promise} A promise that resolves to the generated assignments.
 * If successful, the response JSON will contain a success message with the number of assignments created.
 * If there is an error, the response JSON will contain an error message.
 */
export async function generateAssignments(req, res) {
  const numAssignments = req.body.numAssignments;

  const subjects = await Subject.find();
  const groups = await Group.find();
  const professors = await Professor.find();

  if (subjects.length === 0 || groups.length === 0 || professors.length === 0) {
    console.error(
      `Error creating assignments: No sufficient data to generate assignments`,
    );
    res
      .status(500)
      .json({ message: "No sufficient data to generate assignments" });
    return;
  }

  const assignments = [];
  for (let i = 0; i < numAssignments; i++) {
    const assignment = {
      title: `Devoir ${i + 1}`,
      description: `Description du devoir ${i + 1}`,
      dueDate: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
      subject: subjects[getRandomInt(subjects.length)]._id,
      group: groups[getRandomInt(groups.length)]._id,
      professor: professors[getRandomInt(professors.length)]._id,
    };
    assignments.push(assignment);
  }

  try {
    await Assignment.insertMany(assignments);
    res.json({
      message: `${numAssignments} assignments created successfully!`,
    });
  } catch (error) {
    console.error(`Error creating assignments: ${error}`);
    res.status(500).json({ message: "Error creating assignments" });
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
