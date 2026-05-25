import axiosInstance from "../helper/axiosInstance";

async function createPollService(data) {
  const response = await axiosInstance.post("/poll/create", data);
  return response.data;
}

export default createPollService
