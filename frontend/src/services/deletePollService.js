import axiosInstance from "../helper/axiosInstance.js"
async function deletePollService(pollId) {
  const response = await axiosInstance.delete(`/poll/delete/${pollId}`);
  return response.data;
}

export default deletePollService
