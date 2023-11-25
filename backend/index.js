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
mongoose.connect(process.env.ATLAS_URI || "")
    .then(() => console.log("Connected to MongoDB"))
    .catch(e => console.error(e));


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
            {firstName: "John", lastName: "Doe"},
            {firstName: "Alice", lastName: "Smith"},
            {firstName: "Bob", lastName: "Brown"},
            {firstName: "admin", lastName: "admin"},
        ];
        const [
            profJohnProfile,
            profAliceProfile,
            profBobProfile,
            profAdminProfile,
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
        ];
        for (const professorUser of professorUsers) {
            const user = new User(professorUser);
            await user.save();
        }

        // STUDENTS
        const studentProfiles = [
            {firstName: "John", lastName: "Doe"},
            {firstName: "Jane", lastName: "Doe"},
            {firstName: "Sam", lastName: "Smith"},
            {firstName: "admin", lastName: "admin"},
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
            {name: "Mathematics", professor: profJohnProfile._id},
            {name: "Physics", professor: profAliceProfile._id},
            {name: "Chemistry", professor: profBobProfile._id},
        ];

        const [maths, physics, chemistry] = await Subject.insertMany(subjectData);

        await Professor.findByIdAndUpdate(stdJaneProfile._id, {
            subjects: [maths._id],
        });
        await Professor.findByIdAndUpdate(stdSamProfile._id, {
            subjects: [physics._id, chemistry._id],
        });
        await Professor.findByIdAndUpdate(stdJohnProfile._id, {
            subjects: [maths._id, physics._id, chemistry._id],
        });

        // GROUPS
        const groupData = [
            {name: "Groupe 1", students: [stdJohnProfile._id, stdJaneProfile._id]},
            {name: "Groupe 2", students: [stdSamProfile._id]},
            {name: "Groupe 3", students: [stdJohnProfile._id, stdSamProfile._id]},
            {name: "Groupe 4", students: [stdAdminProfile._id]},
        ];

        const [group1, group2, group3, group4] = await Group.insertMany(groupData);

        // PROMOTIONS
        const promotionData = [
            {
                name: "Promotion 2023",
                groups: [group1._id, group2._id],
            },
            {
                name: "Promotion 2024",
                groups: [group3._id, group4._id],
            },
        ];

        const [promotion2023, promotion2024] = await Promotion.insertMany(
            promotionData
        );

        await Group.findByIdAndUpdate(group1._id, {
            promotion: promotion2023._id,
        });
        await Group.findByIdAndUpdate(group2._id, {
            promotion: promotion2023._id,
        });
        await Group.findByIdAndUpdate(group3._id, {
            promotion: promotion2024._id,
        });
        await Group.findByIdAndUpdate(group4._id, {
            promotion: promotion2024._id,
        });

        // ASSIGNMENTS
        const assignmentData = [
            {
                title: "Devoir Maths 1",
                description: "Description du devoir de maths",
                dueDate: new Date("2023-01-01"),
                subject: maths._id,
                group: group1._id,
                professor: profJohnProfile._id,
            },
            {
                title: "Devoir Physics 1",
                description: "Description du devoir de physique",
                dueDate: new Date("2023-02-01"),
                subject: physics._id,
                group: group2._id,
                professor: profJohnProfile._id,
            },
            {
                title: "Devoir Chemistry 1",
                description: "Description du devoir de chimie",
                dueDate: new Date("2023-03-01"),
                subject: chemistry._id,
                attachment: "https://www.google.com",
                group: [group1._id, group2._id],
                professor: profJohnProfile._id,
            },
            {
                title: "Devoir Maths 2",
                description: "Description du devoir de maths",
                dueDate: new Date("2023-04-01"),
                subject: maths._id,
                group: group3._id,
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Physics 2",
                description: "Description du devoir de physique",
                dueDate: new Date("2023-05-01"),
                subject: physics._id,
                group: group4._id,
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Chemistry 2",
                description: "Description du devoir de chimie",
                dueDate: new Date("2023-06-01"),
                subject: chemistry._id,
                attachment: "https://www.google.com",
                group: [group3._id, group4._id],
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Maths 3",
                description: "Description du devoir de maths",
                dueDate: new Date("2023-07-01"),
                subject: maths._id,
                group: group1._id,
                professor: profBobProfile._id,
            },
            {
                title: "Devoir Physics 3",
                description: "Description du devoir de physique",
                dueDate: new Date("2023-08-01"),
                subject: physics._id,
                group: group2._id,
                professor: profBobProfile._id,
            },
            {
                title: "Devoir Chemistry 3",
                description: "Description du devoir de chimie",
                dueDate: new Date("2023-09-01"),
                subject: chemistry._id,
                attachment: "https://www.google.com",
                group: [group1._id, group2._id],
                professor: profBobProfile._id,
            },
            {
                title: "Devoir Maths 4",
                description: "Description du devoir de maths",
                dueDate: new Date("2023-10-01"),
                subject: maths._id,
                group: group3._id,
                professor: profBobProfile._id,
            },
            {
                title: "Devoir Physics 4",
                description: "Description du devoir de physique",
                dueDate: new Date("2023-11-01"),
                subject: physics._id,
                group: group4._id,
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Chemistry 4",
                description: "Description du devoir de chimie",
                dueDate: new Date("2023-12-01"),
                subject: chemistry._id,
                attachment: "https://www.google.com",
                group: [group3._id, group4._id],
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Maths 5",
                description: "Description du devoir de maths",
                dueDate: new Date("2024-01-01"),
                subject: maths._id,
                group: group1._id,
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Physics 5",
                description: "Description du devoir de physique",
                dueDate: new Date("2024-02-01"),
                subject: physics._id,
                group: group2._id,
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Chemistry 5",
                description: "Description du devoir de chimie",
                dueDate: new Date("2024-03-01"),
                subject: chemistry._id,
                attachment: "https://www.google.com",
                group: [group1._id, group2._id],
                professor: profAliceProfile._id,
            },
            {
                title: "Devoir Maths 6",
                description: "Description du devoir de maths",
                dueDate: new Date("2024-04-01"),
                subject: maths._id,
                group: group3._id,
                professor: profJohnProfile._id,
            },
            {
                title: "Devoir Physics 6",
                description: "Description du devoir de physique",
                dueDate: new Date("2024-05-01"),
                subject: physics._id,
                group: group4._id,
                professor: profJohnProfile._id,
            },
            {
                title: "Devoir Chemistry 6",
                description: "Description du devoir de chimie",
                dueDate: new Date("2024-06-01"),
                subject: chemistry._id,
                attachment: "https://www.google.com",
                group: [group3._id, group4._id],
                professor: profJohnProfile._id,
            },
        ];

        await Assignment.insertMany(assignmentData);

        console.log("Database initialized with extended data!");
    } catch (error) {
        console.error("Error initializing the database:", error);
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
