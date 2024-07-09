import { Button, Tab, Table, TableBody, TableCell, 
    TableContainer, TableHead, TablePagination, TableRow, 
    TextField} from "@mui/material";
import { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';

function MovieTable({count}){
    const [movies, setMovies] = useState([]);
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [newMovieTitle, setNewMovieTitle] = useState("");
    const [editingTitle, setEditingTitle] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
    }, [count]);
    function handleTitleChange(event) {
        setEditingTitle(event.target.value);
    }
    function handleEditMovie(id, title) {
        setEditingTitle(title);
        setEditingMovieId(id); 
    }

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
    async function handleSubmit(movieId) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/movies/${editingMovieId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editingTitle,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update movie');
            }
            const updatedMovies = movies.map((movie) => {
                if (movie.id === editingMovieId) {
                    return {
                        ...movie,
                        title: editingTitle,
                    };
                }
                return movie;
            });
            setMovies(updatedMovies);
            setEditingMovieId(null);
            setEditingTitle('');
        } catch (error) {
            console.error(`Error updating movie: ${error}`);
        }
    }
    function handleNewMovieTitle(event) {
        setNewMovieTitle(event.target.value);
    }
    async function handleCreateMovie() {
        try {
            const response = await fetch('http://127.0.0.1:5000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newMovieTitle,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create movie');
            }
            const newMovie = await response.json();
            if (newMovie) {
                setMovies([...movies, newMovie]);
                setNewMovieTitle(''); 
            }
        } catch (error) {
            console.error(error);
        }
    }
        
    function handleChangePerPage(event, newPage) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event) {
        const nums = parseInt(event.target.value, 10);
        setRowsPerPage(nums);
        setPage(0);
    }

    return (
        <Paper>
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
                    movies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((movie) => {
                        return (
                            <TableRow key={movie.id}>
                                <TableCell>{movie.id}</TableCell>
                                <TableCell>
                                    {editingMovieId === movie.id ? (
                                        <TextField value={editingTitle} onChange={handleTitleChange} />
                                    ): (
                                        movie.title
                                    )}
                                    
                                </TableCell>
                                <TableCell>
                                    {editingMovieId === movie.id ? (
                                        <Button color="primary"
                                        onClick={handleSubmit}
                                        >Save</Button>
                                    ) : (
                                       <>
                                       <Button color="primary" 
                                    onClick={() => {handleEditMovie(movie.id, movie.title)}}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        color="error"
                                        onClick={() => {handleDelete(movie.id)}}
                                    >
                                        Delete
                                        </Button>
                                       </>
                                    )}
                                    
                                </TableCell>
                            </TableRow>

                        );
                    })
                }
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                        <TextField
                            value={newMovieTitle}
                            onChange={handleNewMovieTitle}
                            />
                    </TableCell>
                    <TableCell>
                        <Button color="primary" onClick={handleCreateMovie}>
                            Create 
                        </Button>
                    </TableCell>
                    </TableRow>
            </TableBody>
        </Table>
       </TableContainer>
       <TablePagination 
       component={"div"}
       count={movies.length}
       page={page}
       onPageChange={handleChangePerPage}
       rowsPerPage={rowsPerPage}
       onRowsPerPageChange={handleChangeRowsPerPage}
       ></TablePagination>
       </Paper>
    );
}
export default MovieTable;