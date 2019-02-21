const http = require('http');
const express = require('express');
const omdb = new (require('omdbapi'))('fa3bee26');
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/search/:search', async (req, res) => {
    const search = req.param('search');

    try {
        const movies = await omdb.search({ search, type: 'movie' });

        for (const index in movies) {
            const { genre } = await omdb.get({ id: movies[index].imdbid });
            const genres = Object.values(genre).join(', ');
            movies[index] = { ...movies[index], genre: genres }
        }

        res.send(Object.values(movies));
    } catch (error) {
        res.status(500).json({ error: 'Ops, ocorreu um erro no servidor!' });
    }

});

app.get('/movie/:id', async (req, res) => {
    const id = req.param('id');

    try {
        const movie = await omdb.get({ id });

        const genre = Object.values(movie.genre).join(', ');
        const director = Object.values(movie.director).join(', ');

        const data = {
            ...movie,
            genre,
            director
        }

        res.send(data);
    } catch (error) {
        res.status(500).json({ error: 'Ops, ocorreu um erro no servidor!' });
    }

});

http.createServer(app).listen(80, () => console.log('Server is Up!'));