import axiosInstance from "../helper/axiosInstance";

async function getPollData(pollId) {
  const response = await axiosInstance.get(`/poll/data/${pollId}`);
  return response.data;
}

export default getPollData;
