import api from "./api";

export interface VoiceResponse {
  transcript: string;
  language: string;
  answer: string;
  audio_file: string;
}

export const voiceService = {
  async sendVoice(
    audio: File,
    language: string = "English"
  ): Promise<VoiceResponse> {

    const formData = new FormData();

    formData.append("audio", audio);
    formData.append("language", language);

    const response = await api.post<VoiceResponse>(
      "/voice",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};