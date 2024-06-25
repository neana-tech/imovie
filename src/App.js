import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import HomeIcon from '@mui/icons-material/Home';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MovieTable from './components/movie-table/MovieTable';
import { Movie } from '@mui/icons-material';
import Movies from './pages/movies/Movies';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="*" element={<Movies />} />
        </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
