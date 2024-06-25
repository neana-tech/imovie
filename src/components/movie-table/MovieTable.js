import { Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";

function MovieTable(){
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/movies');
                const data = await response.json();
                setMovies(data);
            } catch (error) {

            }
        };
        fetchMovies();
    }, []);

    async function handleDelete(id) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/movies/${id}`, {
                method: 'DELETE',
            }); 
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
            const newMovies = movies.filter((movie) => movie.id !== id);
            setMovies(newMovies);
        } catch (error) {
            console.error(error);
        }
        
    }

    return (
       <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    movies.map((movie) => {
                        return (
                            <TableRow key={movie.id}>
                                <TableCell>{movie.id}</TableCell>
                                <TableCell>{movie.title}</TableCell>
                                <TableCell>
                                    <Button color="primary">Edit</Button>
                                    <Button 
                                        color="error"
                                        onClick={() => {handleDelete(movie.id)}}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>
       </TableContainer>
    );
}
export default MovieTable;