import express from 'express';
//import cookieParser from 'cookie-parser';
import { db } from './db.js';
import { personneRoute } from './routes/personne.js';
//import { gestionErreurs } from './middlewares/erreurs.js';

export const app = express();

app.use(express.json());        // lit le corps JSON → req.body
//app.use(cookieParser());        // lit les cookies → req.cookies

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({"erreur":"Erreur serveur"});
})


// Vérifie que l'API répond et que la base est joignable
app.get('/', async (req, res) => {
  await db.query('SELECT 1');
  res.json({ api: 'ok', base: 'ok' });
});

app.use('/api/personne', personneRoute);

//app.use(gestionErreurs);        // toujours en dernier
