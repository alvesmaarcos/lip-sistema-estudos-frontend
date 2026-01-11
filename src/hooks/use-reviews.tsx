import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviews,
  toggleReview,
  getReviewStatistics,
} from "@/http/api/review";
import { toast } from "sonner";
import type { Review } from "@/types/review";

export function useReviews() {
  const queryClient = useQueryClient();

  const {
    data: allReviews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await getReviews();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const { data: statistics } = useQuery({
    queryKey: ["reviews", "statistics"],
    queryFn: async () => {
      const response = await getReviewStatistics();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const toggleMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const review = allReviews.find((r) => r.id === reviewId);
      if (!review) throw new Error("Revisão não encontrada");

      const today = new Date().toISOString().split("T")[0];
      if (review.dueDate !== today) {
        throw new Error("Revisão fora da data");
      }

      return toggleReview(reviewId);
    },

    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ["reviews"] });
      const previous = queryClient.getQueryData<Review[]>(["reviews"]);

      queryClient.setQueryData<Review[]>(["reviews"], (old = []) =>
        old.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                completed: !r.completed,
                completedAt: !r.completed
                  ? new Date().toISOString()
                  : undefined,
              }
            : r
        )
      );

      return { previous };
    },

    onError: (error, reviewId, context) => {
      queryClient.setQueryData(["reviews"], context?.previous);
      toast.error("Esta revisão só pode ser concluída no dia correto");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Revisão atualizada!");
    },
  });

  const overdueReviews = allReviews.filter(
    (r) => !r.completed && new Date(r.dueDate) < new Date()
  );

  const todayReviews = allReviews.filter((r) => {
    const today = new Date().toISOString().split("T")[0];
    return !r.completed && r.dueDate === today;
  });

  const completedReviews = allReviews.filter((r) => r.completed);

  const pendingReviews = allReviews.filter((r) => !r.completed);

  return {
    allReviews,
    overdueReviews,
    todayReviews,
    completedReviews,
    pendingReviews,
    statistics,
    isLoading,
    error,
    toggleReview: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
}
