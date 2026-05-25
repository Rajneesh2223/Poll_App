import { z } from "zod";

const pollOptionSchema = z
  .string({
    required_error: "A Option is required",
    invalid_type_error: "A Option must be a string",
  })
  .min(1, "A Option must be at least 1 characters long")
  .max(50, "A Option must be at most 50 characters long")
  .trim();

const pollDataSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long")
    .trim(),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(3, "Description must be at least 3 characters long")
    .max(500, "Description must be at most 500 characters long")
    .trim(),
  options: z
    .array(pollOptionSchema)
    .min(2, "Poll must have at least 2 options")
    .max(10, "Poll can have at most 10 options"),
});


export default pollDataSchema;