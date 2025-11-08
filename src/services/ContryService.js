
import axios from "axios";

const API_BASE = "http://localhost:8080/countries"; 


export const pagingCountries = async (pageIndex, pageSize, keyword = "") => {
  const res = await axios.get(`${API_BASE}?page=${pageIndex}&size=${pageSize}&keyword=${keyword}`);
  console.log("API response:", res);
  return res.data;
};

export const getAll = async() => {
  const res = await axios.get(`${API_BASE}`)
  return res.data;
}


export const getCountry = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const createCountry = async (data) => {
  const res = await axios.post(API_BASE, data);
  return res.data;
};


export const editCountry = async (id, data) => {
  const res = await axios.patch(`${API_BASE}/${id}`, data);
  return res.data;
};


export const deleteCountry = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};