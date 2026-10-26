import express from 'express';
import morgan from 'morgan';
import { routerObjet } from './routes/objets.js';
import { routerCategorie } from './routes/categories.js';
import { routerDepot } from './routes/depots.js';
import { routerPersonne } from './routes/personnes.js';
import { routerStats } from './routes/stats.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));


app.use(routerObjet);
app.use(routerCategorie);
app.use(routerDepot);
app.use(routerPersonne);
app.use(routerStats);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({"erreur":"Erreur serveur"});
})

app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
})