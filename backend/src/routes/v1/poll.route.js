import express from "express";
import { verifyToken } from "../../middlwares/verifyToken.js";
import { addToBookmarkController, createPollController, createVoteController, deletePollController, getAllCreatedPollsController, getAllPolls, getBookmarkPollController, getPollDataController } from "../../controllers/poll.controller.js";
import pollDataSchema from "../../validations/pollDataValidation.js";
import validator from "../../validations/validator.js";
import voteSchema from "../../validations/voteValidation.js";
const pollRouter = express.Router();

/**
 * @swagger
 * /poll/test:
 *   get:
 *     summary: Test route for poll
 *     tags: [Poll]
 *     responses:
 *       200:
 *         description: Success
 */
pollRouter.get("/test", (req, res) => {
    res.json({
        success : true,
        message : "Poll route is working✔️"
    })
})

/**
 * @swagger
 * /poll/create:
 *   post:
 *     summary: Create poll
 *     tags: [Poll]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - title
 *               - description
 *               - options
 *     responses:
 *       201: 
 *         description: Poll created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * 
 */
pollRouter.post("/create", validator(pollDataSchema), verifyToken, createPollController);

/**
 * @swagger
 * /poll/data/{pollId}:
 *   get:
 *     summary: Get poll data
 *     tags: [Poll]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         schema:
 *           type: string
 *         required: true
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll data fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
pollRouter.get("/data/:pollId", verifyToken, getPollDataController);

/**
 * @swagger
 * /poll/created:
 *   get:
 *     summary: Get all created polls
 *     tags: [Poll]
 *     responses:
 *       200:
 *         description: All created polls fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
pollRouter.get("/created", verifyToken, getAllCreatedPollsController);

/**
 * @swagger
 * /poll/delete/{pollId}:
 *   delete:
 *     summary: Delete poll
 *     tags: [Poll]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         schema:
 *           type: string
 *         required: true
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * */
pollRouter.delete("/delete/:pollId", verifyToken, deletePollController);

/**
 *  @swagger
 * /poll/vote:
 *   post:
 *     summary: Create vote
 *     tags: [Vote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pollId:
 *                 type: string
 *               optionId:
 *                  type : string
 *             required:
 *               - pollId
 *               - optionId
 *     responses:
 *       201: 
 *         description: Vote created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404: 
 *          description: Poll not found
 *       500:
 *         description: Internal server error
 */
pollRouter.post("/vote", validator(voteSchema), verifyToken, createVoteController);

/**
 * @swagger
 * /poll/bookmark/{pollId}:
 *   get:
 *     summary: Add poll to bookmark
 *     tags: [Bookmark]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         schema:
 *           type: string
 *         required: true
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll added to bookmark successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * */
pollRouter.get("/bookmark/:pollId", verifyToken, addToBookmarkController);

/**
 * @swagger
 * /poll/bookmarks:
 *   get:
 *     summary: Get bookmarked polls
 *     tags: [Bookmark]
 *     responses:
 *       200:
 *         description: Bookmarked polls fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
pollRouter.get("/bookmarks", verifyToken, getBookmarkPollController);

/**
 * @swagger
 * /poll/all?page={page}&limit={limit}:
 *   get:
 *     summary: Get all polls
 *     tags: [Poll]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit
 *     responses:
 *       200:
 *         description: All polls fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
pollRouter.get("/all", getAllPolls)

export default pollRouter;