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
    <div className="flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen flex-col items-center text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none animate-float-delayed"></div>

      <div className="w-full max-w-4xl glass-panel p-6 md:p-8 rounded-3xl relative z-10 shadow-2xl mt-4 md:mt-8">
        <h1 className="text-3xl font-extrabold mb-2 text-center tracking-tight">
          Create New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">LivePoll</span>
        </h1>
        <p className="text-center text-xs md:text-sm text-gray-400 mb-8">Design your custom question, add choices, and start collecting real-time votes.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            {/* Poll Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold tracking-wider text-gray-300 mb-2">
                POLL TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., What is your favorite programming language?"
                className="input input-bordered w-full glass-input text-white text-sm"
              />
            </div>

            {/* Poll Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold tracking-wider text-gray-300 mb-2">
                DESCRIPTION / PURPOSE
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give your voters some context about this poll..."
                className="textarea textarea-bordered w-full glass-input text-white text-sm"
                rows="4"
              ></textarea>
            </div>
          </div>

          <div>
            {/* Poll Options */}
            <div className="mb-4">
              <label className="block text-sm font-semibold tracking-wider text-gray-300 mb-2">POLL OPTIONS</label>

              <div className="space-y-2 mb-3 max-h-[190px] overflow-y-auto pr-1">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option}
                      placeholder={`Option ${index + 1}`}
                      className="input input-bordered w-full glass-input text-white text-sm cursor-not-allowed opacity-80"
                      readOnly
                    />
                    {options.length > 2 && (
                      <button
                        className="btn btn-error btn-circle btn-xs ml-2 border-red-500/30 hover:bg-red-500/10 text-red-400"
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
              </div>

              {/* Options input field  */}
              <div className="mb-4">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  placeholder="Type a new option option..."
                  className="input input-bordered w-full glass-input text-white text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
              </div>
              <button
                className="btn glass-btn-secondary w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold"
                title="Add another option"
                onClick={handleAddOption}
              >
                <FaPlus className="text-xs" /> Add Option Choice
              </button>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col-reverse gap-4 mt-8 border-t border-blue-500/10 pt-6">
          <button
            className="btn btn-ghost w-full md:w-1/2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white"
            onClick={() => {
              const sure = window.confirm(
                "Are you sure you want to clear the poll?"
              );
              if (sure) {
                handleClearPoll();
              }
            }}
          >
            Reset Form
          </button>
          {/* Submit Button */}
          <button
            className="btn glass-btn-primary w-full md:w-1/2 rounded-xl text-sm font-semibold shadow-lg"
            onClick={handlePollSubmit}
          >
            Create & Deploy Poll
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePollForm;
