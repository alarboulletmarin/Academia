import Group from "../models/Group.js";

/**
 * Creates a new group.
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} req.body - The request body containing the group data.
 * @returns {Object} The saved group object.
 * @throws {Object} Error saving group.
 */
export async function createGroup(req, res) {
    try {
        const group = new Group(req.body);
        const savedGroup = await group.save();
        res.json(savedGroup);
    } catch (error) {
        res.status(500).json({message: "Error saving group"});
    }
}

/**
 * Retrieves a group by its ID.
 * @async
 * @function getGroup
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The group object.
 * @throws {Object} If the group is not found or there is an error retrieving it.
 */
export async function getGroup(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }
        res.json(group);
    } catch (error) {
        res.status(500).json({message: "Error retrieving group"});
    }
}

/**
 * Retrieves all groups from the database
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON object containing all groups
 * @throws {Object} - JSON object containing an error message if there's an error retrieving the groups
 */
export async function getGroups(req, res) {
    try {
        const groups = await Group.find().populate("promotion");

        res.json(groups);
    } catch (error) {
        res.status(500).json({message: "Error retrieving groups"});
    }
}

/**
 * Updates a group by ID.
 * @async
 * @function updateGroup
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The updated group object.
 * @throws {Object} If there's an error updating the group.
 */
export async function updateGroup(req, res) {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }
        Object.assign(group, req.body);
        const savedGroup = await group.save();
        res.json(savedGroup);
    } catch (error) {
        res.status(500).json({message: "Error updating group"});
    }
}

/**
 * Deletes a group by ID.
 * @async
 * @function deleteGroup
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response containing a message indicating whether the group was deleted or not.
 * @throws {Object} - JSON response containing an error message if there was an error deleting the group.
 */
export async function deleteGroup(req, res) {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).json({message: "Group not found"});
        }
        res.json({message: "Group deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error deleting group"});
    }
}
