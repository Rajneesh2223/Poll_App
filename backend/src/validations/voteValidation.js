import { z } from "zod";

const voteSchema = z.object({
  pollId: z.string({
    required_error: "Poll Id is required.",
    invalid_type_error: "Poll Id should be a string.",
  }),
  optionId: z.string({
    required_error: "Option Id is required.",
    invalid_type_error: "Option Id should be a string.",
  }),
});

export default voteSchema;