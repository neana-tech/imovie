import { Autocomplete, Button, Tab, Table, TableBody, TableCell, 
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
    const [order, setOrder] = useState('asc');
    const [orderby, setOrderby] = useState('id');
    const [filterId, setFilterId] = useState('');
    const [filterTitle, setFilterTitle] = useState('');
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
    function handleRequestSort(event, property) {
        const isAsc = orderby === property && order === 'asc';
        setOrder (isAsc ? 'desc' : 'asc');
        setOrder (property);         
    }   
    function getComparator(order, orderby) {
        return order === 'desc' 
        ? (a,b) => descendingComparator(a,b,orderby)
        : (a,b) => -descendingComparator(a,b,orderby); 
    }
    function descendingComparator(a,b,orderby) {
        if (b[orderby] < a[orderby]) {
            return -1;
            }
            if (b[orderby] > a[orderby]) {
            return 1;
            }
            return 0;
    }
    function sortMovies(array, comparator) {
        const result = array.map ((el, index) => [el,index]); 
        result.sort ((a,b)=> {
            const order = comparator(a[0], b[0]); 
            if (order !== 0 ) return order; 
            return a[1] - b[1]; 
        })
        return result.map ((el)=> el[0]);


    }
    const filteredMovies = movies.filter(movie =>{
        return (
            (filterId === '' || movie.id.toString().includes(filterId)) && 
            (filterTitle === '' || movie.title.toLowerCase().includes(filterTitle.toLowerCase()))
        );
    });

    const sortedMovies = sortMovies(filteredMovies, getComparator(order, orderby));
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
                    <TableCell>
                    <Autocomplete 
                    options={movies.map(movie => movie.id.toString())}
                    renderInput={(params)=> (
                        <TextField 
                        {...params}
                        label="Filter Id"
                        variant="standard"
                        size="small"

                        ></TextField>
                    )}
                    onInputChange={(event, value)=> setFilterId(value)}
                    getOptionLabel={(option)=> option.toString()}
                    filterOptions={(options, { inputValue }) =>
options.filter((option) => option.includes(inputValue)).slice(0, 10)
}
                    ></Autocomplete>
                    </TableCell>
                    <TableCell>
                    <Autocomplete 
                    options={movies.map(movie => movie.title.toString())}
                    renderInput={(params)=> (
                        <TextField 
                        {...params}
                        label="Filter Title"
                        variant="standard"
                        size="small"

                        ></TextField>
                    )}
                    onInputChange={(event, value)=> setFilterTitle(value)}
                    getOptionLabel={(option)=> option.toString()}
                    filterOptions={(options, { inputValue }) =>
options.filter((option) => option.includes(inputValue)).slice(0, 10)
}
                    ></Autocomplete>
                    </TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>

                {
                    sortedMovies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((movie) => {
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
       count={sortedMovies.length}
       page={page}
       onPageChange={handleChangePerPage}
       rowsPerPage={rowsPerPage}
       onRowsPerPageChange={handleChangeRowsPerPage}
       ></TablePagination>
       </Paper>
    );
}
export default MovieTable;