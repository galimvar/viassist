import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({"erreur":"Erreur serveur"});
})

app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
})