import axiosInstance from "../helper/axiosInstance";

async function getPollsService(page = 1, limit = 10) {
    const response = await axiosInstance.get(`poll/all?page=${page}&limit=${limit}`);
    return response.data;
}

export default getPollsService;