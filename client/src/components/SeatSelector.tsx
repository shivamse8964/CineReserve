import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Seat } from "@db/schema";

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
}

export function SeatSelector({ seats, selectedSeats, onSeatSelect }: SeatSelectorProps) {
  const rows = Array.from(new Set(seats.map(seat => seat.row))).sort();
  const seatsPerRow = Math.max(...seats.map(seat => seat.number));

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Screen */}
      <div className="relative mb-12">
        <div className="h-2 bg-primary rounded-full mb-2" />
        <p className="text-center text-sm text-muted-foreground">Screen</p>
      </div>

      {/* Seats */}
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-center font-medium">{row}</span>
            <div className="flex-1 grid grid-cols-10 gap-2">
              {Array.from({ length: seatsPerRow }).map((_, i) => {
                const seat = seats.find(s => s.row === row && s.number === i + 1);
                if (!seat) return <div key={i} className="w-8 h-8" />;

                const isSelected = selectedSeats.some(s => s.id === seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => onSeatSelect(seat)}
                    disabled={seat.isBooked || false}
                    className={cn(
                      "w-8 h-8 rounded transition-colors",
                      seat.isBooked && "bg-muted cursor-not-allowed",
                      isSelected && "bg-primary",
                      !seat.isBooked && !isSelected && "bg-secondary hover:bg-primary/50"
                    )}
                  />
                );
              })}
            </div>
            <span className="w-6 text-center font-medium">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-secondary rounded" />
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded" />
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-muted rounded" />
          <span className="text-sm">Booked</span>
        </div>
      </div>
    </div>
  );
}
