import axios from "axios";

// Set the base URL for axios using the environment variable
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // This should be http://localhost:3000
  withCredentials: true  // This is necessary if you're using cookies or sessions
});

export default instance;