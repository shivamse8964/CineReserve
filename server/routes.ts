import type { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "../db";
import { movies, showtimes, seats, bookings } from "@db/schema";
import { and, eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Set up authentication routes
  setupAuth(app);

  // Get all movies
  app.get("/api/movies", async (req, res) => {
    try {
      const allMovies = await db.select().from(movies);
      // Add sample movie data with stock photos
      const sampleMovies = allMovies.map(movie => ({
        ...movie,
        posterUrl: movie.posterUrl || [
          "https://images.unsplash.com/photo-1598827510504-b204c095f5cb",
          "https://images.unsplash.com/photo-1569793667639-dae11573b34f",
          "https://images.unsplash.com/photo-1623116135518-7953c5038f5b",
          "https://images.unsplash.com/photo-1572188863110-46d457c9234d"
        ][Math.floor(Math.random() * 4)]
      }));
      res.json(sampleMovies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  });

  // Get showtimes for a movie
  app.get("/api/movies/:movieId/showtimes", async (req, res) => {
    try {
      const movieShowtimes = await db
        .select()
        .from(showtimes)
        .where(eq(showtimes.movieId, parseInt(req.params.movieId)));
      res.json(movieShowtimes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch showtimes" });
    }
  });

  // Get seats for a showtime
  app.get("/api/showtimes/:showtimeId/seats", async (req, res) => {
    try {
      const showtimeSeats = await db
        .select()
        .from(seats)
        .where(eq(seats.showtimeId, parseInt(req.params.showtimeId)));
      res.json(showtimeSeats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch seats" });
    }
  });

  // Create a booking
  app.post("/api/bookings", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { showtimeId, seatIds } = req.body;

    try {
      // Check if seats are available
      const selectedSeats = await db
        .select()
        .from(seats)
        .where(
          and(
            eq(seats.showtimeId, showtimeId),
            seats.id.in(seatIds as number[])
          )
        );

      if (selectedSeats.some(seat => seat.isBooked)) {
        return res.status(400).json({ error: "Some seats are already booked" });
      }

      // Get showtime for price
      const [showtime] = await db
        .select()
        .from(showtimes)
        .where(eq(showtimes.id, showtimeId))
        .limit(1);

      if (!showtime) {
        return res.status(404).json({ error: "Showtime not found" });
      }

      // Start transaction
      await db.transaction(async (tx) => {
        // Create booking
        const [booking] = await tx
          .insert(bookings)
          .values({
            userId: req.user!.id,
            showtimeId,
            seatId: seatIds[0], // First seat for reference
            totalAmount: showtime.price * seatIds.length,
            status: "confirmed"
          })
          .returning();

        // Update seats to booked
        await Promise.all(
          seatIds.map((seatId: number) =>
            tx
              .update(seats)
              .set({ isBooked: true })
              .where(eq(seats.id, seatId))
          )
        );

        res.json(booking);
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // Get user's bookings
  app.get("/api/bookings", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const userBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.userId, req.user.id));
      res.json(userBookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });
}
