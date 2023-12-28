import Group from "../models/Group.js";
import { errorGroupMessages, statusCodes } from "../constants/constants.js";
import { asyncMiddleware } from "../core/middlewares/errorHandler.js";

/**
 * Saves a new group object to the database.
 *
 * @function
 * @async
 * @param {Object} groupData - The data needed to create a new group.
 * @returns {Object} The saved group object.
 * @throws {Object} Error saving group.
 */
async function saveGroup(groupData) {
  const group = new Group(groupData);
  return await group.save();
}

/**
 * Creates a group and saves it to the database.
 *
 * @function createGroup
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function in the middleware chain.
 * @returns {Promise<void>} - The promise that resolves when the group is created and saved.
 * @throws {Error} - If there is an error while creating or saving the group.
 */
export async function createGroup(req, res, next) {
  try {
    const savedGroup = await saveGroup(req.body);
    res.json(savedGroup);
  } catch (error) {
    error.statusCode = 500;
    error.message = errorGroupMessages.ERROR_SAVING_GROUP;
    next(error);
  }
}

/**
 * Retrieves a group by its ID.
 *
 * @async
 * @function getGroup
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param next
 * @returns {Object} The group object.
 * @throws {Object} If the group is not found or there is an error retrieving it.
 */
export async function getGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      const error = new Error(errorGroupMessages.GROUP_NOT_FOUND);
      error.statusCode = statusCodes.NOT_FOUND;
      next(error);
      return;
    }
    res.json(group);
  } catch (error) {
    error.message = error.message || errorGroupMessages.ERROR_RETRIEVING_GROUP;
    error.statusCode = error.statusCode || statusCodes.SERVER_ERROR;
    next(error);
  }
}

/**
 * Retrieves a list of groups and their associated promotions.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise} - A promise that resolves to the fetched groups.
 * @throws {Error} - If an error occurs during the retrieval process.
 */
export async function getGroups(req, res, next) {
  try {
    const groups = await Group.find().populate("promotion");
    res.json(groups);
  } catch (error) {
    error.message = error.message || errorGroupMessages.GENERIC_ERROR;
    error.statusCode = statusCodes.SERVER_ERROR;
    next(error);
  }
}

/**
 * Represents the function to update a group.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the group is not found.
 * @returns {Promise<void>} Promise that resolves when the group is updated and the response is sent.
 */
export const updateGroup = asyncMiddleware(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    const error = new Error(errorGroupMessages.GROUP_NOT_FOUND);
    error.statusCode = statusCodes.NOT_FOUND;
    throw error;
  }
  Object.assign(group, req.body);
  const savedGroup = await group.save();
  res.json(savedGroup);
});

/**
 * Deletes a group by ID.
 *
 * @async
 * @function deleteGroupById
 * @param {string} id - group id
 * @returns {Object} - deleted group or null if not found
 */
async function deleteGroupById(id) {
  return Group.findByIdAndDelete(id);
}

/**
 * Deletes a group specified by its id.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the group is deleted successfully or rejects with an error if there's any issue during the deletion process.
 */
export async function deleteGroup(req, res, next) {
  try {
    const group = await deleteGroupById(req.params.id);
    if (!group) {
      const error = new Error(errorGroupMessages.GROUP_NOT_FOUND);
      error.statusCode = statusCodes.NOT_FOUND;
      next(error);
      return;
    }
    res.json({ message: errorGroupMessages.DELETE_SUCCESSFUL_MESSAGE });
  } catch (error) {
    error.message = error.message || errorGroupMessages.ERROR_DELETING_GROUP;
    error.statusCode = statusCodes.SERVER_ERROR;
    next(error);
  }
}
