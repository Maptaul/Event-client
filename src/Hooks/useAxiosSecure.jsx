import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://learn-bridge-server-two.vercel.app",
  withCredentials: true,
});

const useAxiosSecure = () => {
  return axiosInstance;
};

export default useAxiosSecure;
