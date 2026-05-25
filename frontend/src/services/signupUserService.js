import axiosInstance from "../helper/axiosInstance"

async function signupUserService(data) {
  const response = await axiosInstance.post("/user/signup", data);
  return response.data;
}

export default signupUserService
