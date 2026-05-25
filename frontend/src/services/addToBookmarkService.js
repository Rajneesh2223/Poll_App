import axiosInstance from "../helper/axiosInstance";

export async function addToBookmarkService(pollId) {
    const response = await axiosInstance.get(`/poll/bookmark/${pollId}`);
    return response.data;
}