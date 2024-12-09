import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const movies = pgTable("movies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  posterUrl: text("poster_url").notNull(),
  releaseDate: timestamp("release_date").notNull(),
});

export const showtimes = pgTable("showtimes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  price: integer("price").notNull(), // in cents
});

export const seats = pgTable("seats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  row: text("row").notNull(),
  number: integer("number").notNull(),
  showtimeId: integer("showtime_id").references(() => showtimes.id).notNull(),
  isBooked: boolean("is_booked").default(false),
});

export const bookings = pgTable("bookings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  showtimeId: integer("showtime_id").references(() => showtimes.id).notNull(),
  seatId: integer("seat_id").references(() => seats.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  totalAmount: integer("total_amount").notNull(), // in cents
  status: text("status").notNull(), // confirmed, cancelled
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertMovieSchema = createInsertSchema(movies);
export const selectMovieSchema = createSelectSchema(movies);
export const insertShowtimeSchema = createInsertSchema(showtimes);
export const selectShowtimeSchema = createSelectSchema(showtimes);
export const insertSeatSchema = createInsertSchema(seats);
export const selectSeatSchema = createSelectSchema(seats);
export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);

// Types
export type User = z.infer<typeof selectUserSchema>;
export type Movie = z.infer<typeof selectMovieSchema>;
export type Showtime = z.infer<typeof selectShowtimeSchema>;
export type Seat = z.infer<typeof selectSeatSchema>;
export type Booking = z.infer<typeof selectBookingSchema>;
