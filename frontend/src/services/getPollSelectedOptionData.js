import axiosInstance from "../helper/axiosInstance";

export async function getPollSelectedOptionData(pollId) {
    const response = await axiosInstance.get(`vote/voted/${pollId}`);
    return response.data;
}