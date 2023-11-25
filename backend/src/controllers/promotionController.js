import Promotion from "../models/Promotion.js";

export async function createPromotion(req, res) {
    try {
        const promotion = new Promotion(req.body);
        const savedPromotion = await promotion.save();
        res.json(savedPromotion);
    } catch (error) {
        res.status(500).json({message: "Error saving promotion"});
    }
}

export async function getPromotion(req, res) {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) {
            return res.status(404).json({message: "Promotion not found"});
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({message: "Error retrieving promotion"});
    }
}

export async function getPromotions(req, res) {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);
    } catch (error) {
        res.status(500).json({message: "Error retrieving promotions"});
    }
}

export async function updatePromotion(req, res) {
    try {
        const promotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if (!promotion) {
            return res.status(404).json({message: "Promotion not found"});
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({message: "Error updating promotion"});
    }
}

export async function deletePromotion(req, res) {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!promotion) {
            return res.status(404).json({message: "Promotion not found"});
        }
        res.json({message: "Promotion deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting promotion"});
    }
}
