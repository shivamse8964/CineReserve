import { format } from "date-fns";
import type { Showtime } from "@db/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  selectedShowtime: Showtime | null;
  onShowtimeSelect: (showtime: Showtime) => void;
}

export function ShowtimeSelector({
  showtimes,
  selectedShowtime,
  onShowtimeSelect,
}: ShowtimeSelectorProps) {
  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const date = format(new Date(showtime.startTime), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedShowtimes).map(([date, times]) => (
        <div key={date}>
          <h3 className="text-lg font-semibold mb-3">
            {format(new Date(date), "EEEE, MMMM d")}
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {times.map((showtime) => (
              <Button
                key={showtime.id}
                variant="outline"
                onClick={() => onShowtimeSelect(showtime)}
                className={cn(
                  "text-center",
                  selectedShowtime?.id === showtime.id && "bg-primary text-primary-foreground"
                )}
              >
                {format(new Date(showtime.startTime), "h:mm a")}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
