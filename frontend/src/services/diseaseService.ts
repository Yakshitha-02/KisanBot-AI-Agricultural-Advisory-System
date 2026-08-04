import axios from "axios";
import { ApiResponse } from "../types/disease";

const API_URL = "http://127.0.0.1:8000/api/disease/predict";
export const predictDisease = async (
  file: File,
  language: string
): Promise<ApiResponse> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("language", language);

  const response = await axios.post<ApiResponse>(
    API_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};