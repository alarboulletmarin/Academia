import Subject from "../models/Subject.js";

export async function createSubject(req, res) {
    try {
        const subject = new Subject(req.body);
        const savedSubject = await subject.save();
        res.json(savedSubject);
    } catch (error) {
        res.status(500).json({message: "Error saving subject"});
    }
}

export async function getSubject(req, res) {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({message: "Subject not found"});
        }
        res.json(subject);
    } catch (error) {
        res.status(500).json({message: "Error retrieving subject"});
    }
}

export async function getSubjects(req, res) {
    try {
        const subjects = await Subject.find();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({message: "Error retrieving subjects"});
    }
}

export async function updateSubject(req, res) {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!subject) {
            return res.status(404).json({message: "Subject not found"});
        }
        res.json(subject);
    } catch (error) {
        res.status(500).json({message: "Error updating subject"});
    }
}

export async function deleteSubject(req, res) {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res.status(404).json({message: "Subject not found"});
        }
        res.json({message: "Subject deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting subject"});
    }
}
