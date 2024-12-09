import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";
import type { Movie } from "@db/schema";

interface MovieCardProps {
  movie: Movie;
  onBook: () => void;
}

export function MovieCard({ movie, onBook }: MovieCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[2/3] relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {movie.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{movie.duration} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button onClick={onBook} className="w-full">
          Book Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}
