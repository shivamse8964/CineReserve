import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Showtime, Seat } from "@db/schema";

interface CreateBookingPayload {
  showtimeId: number;
  seatIds: number[];
}

export function useBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createBooking = useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["seats", variables.showtimeId],
      });
      toast({
        title: "Success",
        description: "Your booking has been confirmed!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createBooking: createBooking.mutateAsync,
    isLoading: createBooking.isPending,
  };
}
