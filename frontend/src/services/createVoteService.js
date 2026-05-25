import axiosInstance from "../helper/axiosInstance";

async function createVoteService(data) {
  const response = await axiosInstance.post("/poll/vote", data);
  return response.data;
}

export default createVoteService
