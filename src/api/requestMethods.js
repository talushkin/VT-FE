import axios from "axios";
import { baseURL, guestyBaseURL } from "../core";

export const TOKEN = localStorage.getItem("jToken");

export const publicRequest = axios.create({
  baseURL: baseURL,
});

export const userRequest = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const guestyRequest = axios.create({
  baseURL: guestyBaseURL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});
