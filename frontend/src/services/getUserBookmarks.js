import axiosInstance from "../helper/axiosInstance";

export async function getUserBookmarks() {
    const response = await axiosInstance.get("/poll/bookmarks");
    return response.data;
}