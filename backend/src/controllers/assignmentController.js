import Assignment from "../models/Assignment.js";
import Subject from "../models/Subject.js";
import Professor from "../models/Professor.js";
import Group from "../models/Group.js";

/**
 * Creates a new assignment.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The saved assignment object.
 */
export async function createAssignment(req, res) {
  try {
    let attachmentPaths = [];
    if (req.files && Array.isArray(req.files)) {
      attachmentPaths = req.files.map((file) => file.path);
    }

    const assignmentData = {
      ...req.body,
      attachments: attachmentPaths,
    };

    const assignment = new Assignment(assignmentData);
    const savedAssignment = await assignment.save();
    res.json(savedAssignment);
  } catch (error) {
    console.error("Error saving assignment:", error);
    res.status(500).json({ message: "Error saving assignment" });
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
    } = req.query;

    const skip = (page - 1) * limit;

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

    let professorParam = req.query.professor;
    professorParam = professorParam ? professorParam.split(" ") : null;

    if (professorParam) {
      let professorQuery = {
        lastName: professorParam[1],
        firstName: professorParam[0],
      };

      let professorDoc = await Professor.findOne(professorQuery);
      if (professorDoc) {
        filterOptions.professor = professorDoc._id;
      } else {
        return res.status(404).json({ message: "Professor not found" });
      }
    }

    const assignments = await Assignment.find(filterOptions)
      .populate("subject")
      .populate("professor")
      .populate("group")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

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
