// CreatePollForm.js
import React, { useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { useMutation } from "react-query";
import createPollService from "../services/createPollService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreatePollForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");
  const navigate = useNavigate();

  const handleAddOption = () => {
    if (optionInput.trim() == "") {
      return;
    }
    setOptions((prev) => [...prev, optionInput]);
    setOptionInput("");
  };

  const handleClearPoll = () => {
    setTitle("");
    setDescription("");
    setOptions([]);
    setOptionInput("");
  };

  const mutation = useMutation(createPollService, {
    onSuccess: (data) => {
      const message = data?.message || "Poll created successfully";
      toast.success(message);
      handleClearPoll();
      navigate(`/view/${data?.data?._id}`);
    },
    onError: (error) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });

  const handlePollSubmit = (e) => {
    e.preventDefault();
    if (title.trim() == "" || description.trim() == "" || options.length == 0) {
      toast.error("All fields are required");
      return;
    }
    mutation.mutate({ title, description, options });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="w-full p-6 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Create New Poll</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Poll Title */}
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Poll Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter poll title"
                className="input input-bordered w-full"
              />
            </div>

            {/* Poll Description */}
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of the poll"
                className="textarea textarea-bordered w-full"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div>
            {/* Poll Options */}
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Options</label>

              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    placeholder={`Option ${index + 1}`}
                    className="input input-bordered w-full cursor-not-allowed"
                    readOnly
                  />
                  {options.length > 2 && (
                    <button
                      className="btn btn-error btn-circle btn-xs ml-2"
                      title="Remove option"
                      onClick={() =>
                        setOptions(options.filter((_, i) => i !== index))
                      }
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
              ))}

              {/* Options input field  */}
              <div className="mb-4">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  placeholder="Enter new option"
                  className="input input-bordered w-full"
                />
              </div>
              <button
                className="btn btn-primary w-full mt-2"
                title="Add another option"
                onClick={handleAddOption}
              >
                <FaPlus className="mr-2" /> Add Option
              </button>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col-reverse gap-4">
          <button
            className="btn btn-ghost w-full mt-4 md:w-1/2"
            onClick={() => {
              const sure = window.confirm(
                "Are you sure you want to clear the poll?"
              );
              if (sure) {
                handleClearPoll();
              }
            }}
          >
            Clear Poll
          </button>
          {/* Submit Button */}
          <button
            className="btn btn-success w-full  mt-4 md:w-1/2"
            onClick={handlePollSubmit}
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePollForm;
