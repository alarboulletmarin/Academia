import Submission from "../models/Submission.js";

export async function createSubmission(req, res) {
    try {
        const submission = new Submission(req.body);
        const savedSubmission = await submission.save();
        res.json(savedSubmission);
    } catch (error) {
        res.status(500).json({message: "Error saving submission"});
    }
}

export async function getSubmission(req, res) {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({message: "Submission not found"});
        }
        res.json(submission);
    } catch (error) {
        res.status(500).json({message: "Error retrieving submission"});
    }
}

export async function getSubmissions(req, res) {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (error) {
        res.status(500).json({message: "Error retrieving submissions"});
    }
}

export async function updateSubmission(req, res) {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({message: "Submission not found"});
        }
        Object.assign(submission, req.body);
        const updatedSubmission = await submission.save();
        res.json(updatedSubmission);
    } catch (error) {
        res.status(500).json({message: "Error updating submission"});
    }
}

export async function deleteSubmission(req, res) {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({message: "Submission not found"});
        }
        res.json({message: "Submission deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting submission"});
    }
}
