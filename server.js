const http = require('http');
const express = require('express');
const cors = require('cors');
const omdb = new (require('omdbapi'))('fa3bee26');
const app = express();

app.use(cors());

app.get('/search/:search', async (req, res) => {
    const search = req.param('search');

    try {
        const movies = await omdb.search({ search, type: 'movie' });

        for (const index in movies) {
            const { genre } = await omdb.get({ id: movies[index].imdbid });
            movies[index] = { ...movies[index], genre }
        }

        res.send(movies);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }

});

app.get('/movie/:id', async (req, res) => {
    const id = req.param('id');

    try {
        const movie = await omdb.get({ id })
        res.send(movie);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }

});

http.createServer(app).listen(80, () => console.log('Server is Up!'));