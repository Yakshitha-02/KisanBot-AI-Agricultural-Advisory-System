import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kisanbot_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export const documentAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
        "/documents/upload-document",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/documents/documents");
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/documents/document/${id}`);
    return response.data;
  },
  preview(id: number) {
    return `${API_BASE_URL}/documents/preview/${id}`;
},

download(id: number) {
    return `${API_BASE_URL}/documents/download/${id}`;
},
translate: async (id: number, language: string) => {
    const response = await api.post(
        `/documents/translate/${id}/${language}`,
        {},
        {
            responseType: "blob",
        }
    );

    return response.data;
},
};
export default api;