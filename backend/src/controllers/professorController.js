import Professor from "../models/Professor.js";

export async function createProfessor(req, res) {
    try {
        const professor = new Professor(req.body);
        const savedProfessor = await professor.save();
        res.json(savedProfessor);
    } catch (error) {
        res.status(500).json({message: "Error saving professor"});
    }
}

export async function getProfessor(req, res) {
    try {
        const professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({message: "Professor not found"});
        }
        res.json(professor);
    } catch (error) {
        res.status(500).json({message: "Error retrieving professor"});
    }
}

export async function getProfessors(req, res) {
    try {
        const professors = await Professor.find();
        res.json(professors);
    } catch (error) {
        res.status(500).json({message: "Error retrieving professors"});
    }
}

export async function updateProfessor(req, res) {
    try {
        const professor = await Professor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if (!professor) {
            return res.status(404).json({message: "Professor not found"});
        }
        res.json(professor);
    } catch (error) {
        res.status(500).json({message: "Error updating professor"});
    }
}

export async function deleteProfessor(req, res) {
    try {
        const professor = await Professor.findByIdAndDelete(req.params.id);
        if (!professor) {
            return res.status(404).json({message: "Professor not found"});
        }
        res.json({message: "Professor deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting professor"});
    }
}
