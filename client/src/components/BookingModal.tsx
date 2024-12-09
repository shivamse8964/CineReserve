import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShowtimeSelector } from "./ShowtimeSelector";
import { SeatSelector } from "./SeatSelector";
import type { Movie, Showtime, Seat } from "@db/schema";
import { Loader2 } from "lucide-react";

interface BookingModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ movie, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { toast } = useToast();

  const { data: showtimes, isLoading: loadingShowtimes } = useQuery<Showtime[]>({
    queryKey: ["showtimes", movie.id],
    queryFn: async () => {
      const response = await fetch(`/api/movies/${movie.id}/showtimes`);
      if (!response.ok) throw new Error("Failed to fetch showtimes");
      return response.json();
    },
  });

  const { data: seats, isLoading: loadingSeats } = useQuery<Seat[]>({
    queryKey: ["seats", selectedShowtime?.id],
    enabled: !!selectedShowtime,
    queryFn: async () => {
      const response = await fetch(`/api/showtimes/${selectedShowtime!.id}/seats`);
      if (!response.ok) throw new Error("Failed to fetch seats");
      return response.json();
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId: selectedShowtime!.id,
          seatIds: selectedSeats.map(seat => seat.id),
        }),
      });
      if (!response.ok) throw new Error("Failed to create booking");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your booking has been confirmed!",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSeatToggle = (seat: Seat) => {
    setSelectedSeats(prev =>
      prev.some(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{movie.title}</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Select Showtime</h3>
            {loadingShowtimes ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ShowtimeSelector
                showtimes={showtimes || []}
                selectedShowtime={selectedShowtime}
                onShowtimeSelect={setSelectedShowtime}
              />
            )}
          </div>
        )}

        {step === 2 && selectedShowtime && (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Select Seats</h3>
            {loadingSeats ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <SeatSelector
                seats={seats || []}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatToggle}
              />
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <div className="ml-auto space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {step === 1 && (
              <Button
                disabled={!selectedShowtime}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            )}
            {step === 2 && (
              <Button
                disabled={selectedSeats.length === 0 || bookingMutation.isPending}
                onClick={() => bookingMutation.mutate()}
              >
                {bookingMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
