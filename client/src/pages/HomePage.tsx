import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import { MovieCard } from "../components/MovieCard";
import { BookingModal } from "../components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Movie } from "@db/schema";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await fetch("/api/movies");
      if (!response.ok) throw new Error("Failed to fetch movies");
      return response.json();
    },
  });

  const filteredMovies = movies?.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="h-[50vh] relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1461151304267-38535e780c79")',
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Book Your Movie Experience</h1>
          <p className="text-xl mb-8">Watch the latest movies in ultimate comfort</p>
          <div className="w-full max-w-md px-4 relative">
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Now Showing</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[400px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies?.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBook={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedMovie && (
        <BookingModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
