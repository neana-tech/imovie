import { Movie } from "@mui/icons-material";
import { Button } from "@mui/material";
import MovieTable from "../../components/movie-table/MovieTable";
import { useState } from "react";
import LoadMovieData from "../../components/load-movies-data/LoadMovieData";

const Movies = () => {

    const [count, setCount] = useState(0);  

    async function handleDeleteAll() {
        try {
            const response = await fetch('http://127.0.0.1:5000/movies', {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete movies');
            }
            setCount(c => c + 1);
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div>
      <h1>Movies</h1>
      <Button onClick={handleDeleteAll}>
        DELETE ALL
      </Button>
      <LoadMovieData setCount={setCount}></LoadMovieData>
      <MovieTable count={count}/>
    </div>
  );
}
export default Movies;