import axios from "axios";

const agent = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true
})

export default agent;