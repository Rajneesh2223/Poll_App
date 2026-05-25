import axiosInstance from "../helper/axiosInstance";

async function logoutService() {
    const response = await axiosInstance.get("/user/logout");
    return response.data;
}

export default logoutService
