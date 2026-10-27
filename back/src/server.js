import { app } from "./app.js";


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({"erreur":"Erreur serveur"});
})

app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
})