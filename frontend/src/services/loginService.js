import axiosInstance from "../helper/axiosInstance";

export async function loginService(data) {
    const response = await axiosInstance.post("/user/signin", data);
    return response.data;
}