const express = require("express");
const { getAllPolls } = require("../controller/pollcontroller");
const router = express.Router();

router.get("/poll-history", async (req, res) => {
  try {
    const polls = await getAllPolls();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch poll history" });
  }
});

module.exports = router;
