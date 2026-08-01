import api from "./api";

export const feedbackService = {
  submit(payload: {
    message_id: number;
    rating: "positive" | "negative";
    comment?: string;
  }) {
    return api.post("/feedback", payload);
  },

  getMyFeedback() {
    return api.get("/feedback/my");
  },

  getAllFeedback() {
    return api.get("/feedback/all");
  },
};