export interface StartInterviewRequest {
  candidateName: string;
  interviewTypeId?: number;
}

export interface StartInterviewResponse {
  success: boolean;
  data: {
    initialMessage: string;
    interviewId: number;
    candidateName: string;
    timestamp: string;
  };
}
