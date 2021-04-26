import axios from "axios";

const agent = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true
})

export const downloadAgent = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  responseType: 'blob'
})

export default agent;