/**
 * @file This is the main entry point of the backend server for the Academia application.
 * It initializes the express server, connects to MongoDB, and sets up the routes for various API endpoints.
 * The server listens on the specified port for incoming requests.
 */

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import "./loadEnvironment.js";

import assignmentRoutes from "./src/routes/assignmentRoutes.js";
import groupRoutes from "./src/routes/groupRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import subjectRoutes from "./src/routes/subjectRoutes.js";
import professorRoutes from "./src/routes/professorRoutes.js";
import promotionRoutes from "./src/routes/promotionRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";

import Student from "./src/models/Student.js";
import Group from "./src/models/Group.js";
import Assignment from "./src/models/Assignment.js";
import Professor from "./src/models/Professor.js";
import Promotion from "./src/models/Promotion.js";
import Subject from "./src/models/Subject.js";
import User from "./src/models/User.js";
import Submission from "./src/models/Submission.js";

// Initialize express
const app = express();

app.use(express.json());

app.use(cors());

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pour accepter les connexions cross-domain (CORS)
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

// Body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const uri = process.env.ATLAS_URI;
mongoose
  .connect(process.env.ATLAS_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.error(e));

async function run() {
  try {
    // Nettoyage de la base de données
    await Student.deleteMany();
    await Group.deleteMany();
    await Assignment.deleteMany();
    await Professor.deleteMany();
    await Promotion.deleteMany();
    await Subject.deleteMany();
    await Submission.deleteMany();
    await User.deleteMany();

    // PROFESSORS
    const professorProfiles = [
      { firstName: "John", lastName: "Doe" },
      { firstName: "Alice", lastName: "Smith" },
      { firstName: "Bob", lastName: "Brown" },
      { firstName: "admin", lastName: "admin" },
      { firstName: "Michel", lastName: "Buffa" },
      { firstName: "Stéphane", lastName: "Tounsi" },
      { firstName: "Philippe", lastName: "Lahire" },
      { firstName: "Léo", lastName: "Donati" },
    ];
    const [
      profJohnProfile,
      profAliceProfile,
      profBobProfile,
      profAdminProfile,
      profBuffaProfile,
      profTounsiProfile,
      profLahireProfile,
      profDonatiProfile,
    ] = await Professor.insertMany(professorProfiles);

    // Create Users for the professors
    const professorUsers = [
      {
        email: "prof.john.doe@example.com",
        password: "example",
        role: "professor",
        profile: profJohnProfile._id,
        onModel: "Professor",
      },
      {
        email: "prof.alice.smith@example.com",
        password: "example",
        role: "professor",
        profile: profAliceProfile._id,
        onModel: "Professor",
      },
      {
        email: "prof.bob@mail.com",
        password: "example",
        role: "professor",
        profile: profBobProfile._id,
        onModel: "Professor",
      },
      {
        email: "prof.admin@mail.com",
        password: "admin",
        role: "professor",
        profile: profAdminProfile._id,
        onModel: "Professor",
      },
      {
        email: "prof.buffa@mail.com",
        password: "buffa",
        role: "professor",
        profile: profBuffaProfile._id,
        onModel: "Professor",
      },
      {
        email: "prof.tounsi@mail.com",
        password: "tounsi",
        role: "professor",
        profile: profTounsiProfile._id,
        onModel: "Professor",
      },
      {
        email: "prof.lahire@mail.com",
        password: "lahire",
        role: "professor",
        profile: profLahireProfile._id,
        onModel: "Professor",
      },
      {
        email: "prof.donati@mail.com",
        password: "donati",
        role: "professor",
        profile: profDonatiProfile._id,
        onModel: "Professor",
      },
    ];
    for (const professorUser of professorUsers) {
      const user = new User(professorUser);
      await user.save();
    }

    // STUDENTS
    const studentProfiles = [
      { firstName: "John", lastName: "Doe" },
      { firstName: "Jane", lastName: "Doe" },
      { firstName: "Sam", lastName: "Smith" },
      { firstName: "admin", lastName: "admin" },
    ];
    const [stdJohnProfile, stdJaneProfile, stdSamProfile, stdAdminProfile] =
      await Student.insertMany(studentProfiles);

    // Create Users for the students
    const studentUsers = [
      {
        email: "student.john.doe@example.com",
        password: "example",
        role: "student",
        profile: stdJohnProfile._id,
        onModel: "Student",
      },
      {
        email: "student.jane.doe@example.com",
        password: "example",
        role: "student",
        profile: stdJaneProfile._id,
        onModel: "Student",
      },
      {
        email: "sam.smith@example.com",
        password: "example",
        role: "student",
        profile: stdSamProfile._id,
        onModel: "Student",
      },
      {
        email: "student.admin@mail.com",
        password: "admin",
        role: "student",
        profile: stdAdminProfile._id,
        onModel: "Student",
      },
    ];
    for (const studentUser of studentUsers) {
      const user = new User(studentUser);
      await user.save();
    }

    // SUBJECTS
    const subjectData = [
      { name: "Mathematics", professor: profDonatiProfile._id },
      { name: "Web", professor: profBuffaProfile._id },
      { name: "Programmation Avancée", professor: profLahireProfile._id },
      { name: "Gestion de Projet", professor: profTounsiProfile._id },
    ];

    const [maths, web, progAvancee, gestionProject] =
      await Subject.insertMany(subjectData);

    await Professor.findByIdAndUpdate(stdJaneProfile._id, {
      subjects: [maths._id],
    });
    await Professor.findByIdAndUpdate(stdSamProfile._id, {
      subjects: [web._id, progAvancee._id],
    });
    await Professor.findByIdAndUpdate(stdJohnProfile._id, {
      subjects: [maths._id, progAvancee._id, gestionProject._id],
    });

    // GROUPS
    const groupData = [
      { name: "Groupe 1", students: [stdJohnProfile._id, stdJaneProfile._id] },
      { name: "Groupe 2", students: [stdSamProfile._id] },
      { name: "Groupe 1", students: [stdJohnProfile._id, stdJaneProfile._id] },
      { name: "Groupe 2", students: [stdJohnProfile._id, stdJaneProfile._id] },
      { name: "Groupe 3", students: [stdJohnProfile._id, stdJaneProfile._id] },
      { name: "Groupe 1", students: [stdJohnProfile._id, stdJaneProfile._id] },
      { name: "Groupe 2", students: [stdJohnProfile._id, stdJaneProfile._id] },
    ];

    const [
      group1L3,
      group2L3,
      group1M1,
      group2M1,
      group3M1,
      group1M2,
      group2M2,
    ] = await Group.insertMany(groupData);

    // PROMOTIONS
    const promotionData = [
      {
        name: "Promotion 2023 - L3",
        groups: [group1L3._id, group2L3._id],
      },
      {
        name: "Promotion 2023 - M1",
        groups: [group1M1._id, group2M1._id, group3M1._id],
      },
      {
        name: "Promotion 2023 - M2",
        groups: [group1M2._id, group2M2._id],
      },
    ];

    const [promotion2023L3, promotion2023M1, promotion2023M2] =
      await Promotion.insertMany(promotionData);

    await Group.findByIdAndUpdate(group1L3._id, {
      promotion: promotion2023L3._id,
    });

    await Group.findByIdAndUpdate(group2L3._id, {
      promotion: promotion2023L3._id,
    });

    await Group.findByIdAndUpdate(group1M1._id, {
      promotion: promotion2023M1._id,
    });

    await Group.findByIdAndUpdate(group2M1._id, {
      promotion: promotion2023M1._id,
    });

    await Group.findByIdAndUpdate(group3M1._id, {
      promotion: promotion2023M1._id,
    });

    await Group.findByIdAndUpdate(group1M2._id, {
      promotion: promotion2023M2._id,
    });

    await Group.findByIdAndUpdate(group2M2._id, {
      promotion: promotion2023M2._id,
    });

    // ASSIGNMENTS

    const assignmentsTitles = [
      "Devoir Maths",
      "Devoir Web",
      "Devoir Programmation Avancée",
      "Devoir Gestion de Projet",
    ];
    const assignmentsDescriptions = [
      "Description du devoir de maths",
      "Description du devoir de web",
      "Description du devoir de programmation avancée",
      "Description du devoir de gestion de projet",
    ];
    const assignmentsDueDates = [
      new Date("2024-01-01"),
      new Date("2024-02-01"),
      new Date("2024-03-01"),
      new Date("2024-04-01"),
      new Date("2024-05-01"),
      new Date("2024-06-01"),
      new Date("2024-07-01"),
      new Date("2024-08-01"),
      new Date("2024-09-01"),
    ];
    const assignmentsSubjects = [
      maths._id,
      web._id,
      progAvancee._id,
      gestionProject._id,
    ];
    const assignmentsGroups = [
      group1L3._id,
      group2L3._id,
      group1M1._id,
      group2M1._id,
      group3M1._id,
      group1M2._id,
      group2M2._id,
    ];
    const assignmentsProfessors = [
      profDonatiProfile._id,
      profBuffaProfile._id,
      profLahireProfile._id,
      profTounsiProfile._id,
    ];
    const numAssignments = 10000;
    const assignments = [];
    for (let i = 0; i < numAssignments; i++) {
      const assignment = {
        title: `Devoir ${i + 1}`,
        description: `Description du devoir ${i + 1}`,
        dueDate: getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
        subject: assignmentsSubjects[getRandomInt(assignmentsSubjects.length)],
        group: assignmentsGroups[getRandomInt(assignmentsGroups.length)],
        professor:
          assignmentsProfessors[getRandomInt(assignmentsProfessors.length)],
      };
      assignments.push(assignment);
    }

    try {
      await Assignment.insertMany(assignments);
      console.log(`${numAssignments} assignments created successfully!`);
    } catch (error) {
      console.error(`Error creating assignments: ${error}`);
    }
  } catch (error) {
    console.error("Error initializing the database:", error);
  }

  //
  //   await Assignment.insertMany(assignmentData);
  //
  //   console.log("Database initialized with extended data!");
  // } catch (error) {
  //   console.error("Error initializing the database:", error);
  // }
  // }

  function getRandomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}

run().catch(console.dir);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/assignments", assignmentRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/submissions", submissionRoutes);

// Serve static files from the Angular app
// app.use(express.static(path.join(__dirname, "/dist/frontend/")));
//
// // Catch all other routes and return the index file
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/dist/frontend/", "index.html"));
// });
