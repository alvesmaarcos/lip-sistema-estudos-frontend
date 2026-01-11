import { api } from "./index";
import type { Review, CreateReviewDTO, ReviewStatistics } from "@/types/review";

export async function getReviews() {
  return api.get<Review[]>("/reviews");
}

export async function updateReviewDate(
  reviewId: string,
  dueDate: string
): Promise<Review> {
  const { data } = await api.patch(`/reviews/${reviewId}`, { dueDate });
  return data;
}

export async function getReviewsByStatus(
  status: "pending" | "completed" | "overdue"
) {
  return api.get<Review[]>(`/reviews/status/${status}`);
}

export async function getReviewStatistics() {
  return api.get<ReviewStatistics>("/reviews/statistics");
}

export async function createReview(data: CreateReviewDTO) {
  return api.post<Review>("/reviews", data);
}

export async function createReviewsForStudy(studyRecordId: string) {
  return api.post<Review[]>("/reviews/generate", { studyRecordId });
}

export async function toggleReview(reviewId: string) {
  return api.patch<Review>(`/reviews/${reviewId}/toggle`);
}

export async function completeReview(reviewId: string) {
  return api.patch<Review>(`/reviews/${reviewId}/complete`);
}

export async function deleteReview(reviewId: string) {
  return api.delete(`/reviews/${reviewId}`);
}

export async function deleteReviewsByStudy(studyRecordId: string) {
  return api.delete(`/reviews/study/${studyRecordId}`);
}
