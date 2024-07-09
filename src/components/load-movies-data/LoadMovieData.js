import React from 'react';
import Button from '@mui/material/Button';

const LoadMovieData = ({setCount}) => {
  const titles = [
    "Spiderman",
    "Batman",
    "Ironman",
    "Hulk",
    "Thor",
    "Captain America",
    "Black Panther",
    "Wonder Woman",
    "Aquaman",
    "Flash",
    "Green Lantern",
    "Doctor Strange",
    "Ant-Man",
    "Wasp",
    "Black Widow",
    "Hawkeye",
    "Scarlet Witch",
    "Vision",
    "Falcon",
    "Winter Soldier",
    "Star-Lord",
    "Gamora",
    "Drax",
    "Rocket Raccoon"
  ];
  const loadMovieData = async () => {
    const URL = 'http://127.0.0.1:5000/movies';

    for (const title of titles) {
      try {
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title }),
        });

        if (!response.ok) {
          console.error(`Failed to add movie: ${title}`, response.statusText);
        }
        setCount(s => s + 1);
      } catch (error) {
        console.error(`Error adding movie: ${title}`, error);
      }
    }

    console.log('Data population completed!');
  };

  return (
    <div>
      <Button color="primary" onClick={loadMovieData}>
        Load Movie Data
      </Button>
    </div>
  );
};

export default LoadMovieData;
