import { getPollVoteService, voteMessageTestService } from "../services/vote.service.js";

export async function voteTestController(req, res) {
    try{
        const message = voteMessageTestService();
        res.json({
            success: true,
            message: message,
        });
    }
    catch(err) {
        console.log(err);
        if (err.statusCode) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}

export async function getPollVoteController(req, res) {
    try {
        const pollId = req.params.pollId;
        const userId = req.user._id;
        const vote = await getPollVoteService(pollId, userId);
        res.status(200).json({
            success: true,
            message: "Poll data fetched successfully",
            data: vote,
        });
    }
    catch (err) {
        console.log(err);
        if (err.statusCode) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
}