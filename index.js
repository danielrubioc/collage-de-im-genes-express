const express = require("express");
const expressFileUpload = require("express-fileupload");
const fs = require("fs");
const app = express();

app.use(express.static(__dirname + "/public"));
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    expressFileUpload({
        limit: 50 * 1024 * 1024, // 5MB
        abortOnLimit: true,
        responseOnLimit: "El peso máximo es de 5MB",
    })
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/formulario.html");
});

app.get("/collage", (req, res) => {
    res.sendFile(__dirname + "/public/collage.html");
});

app.get("/imagen", (req, res) => {
    return res.sendFile(express.static(__dirname + "/public/formulario.html"));
});

app.post("/imagen", (req, res) => {
    const { posicion } = req.body;
    const { mimetype, size } = req.files.target_file;
    const ruta = `${__dirname}/public/imgs/imagen-${posicion}.jpg`;

    const mimetypes = ["image/jpeg", "image/png"];
    if (!mimetypes.includes(mimetype)) {
        return res.send("solo png, jpeg y jpg");
    }

    if (size >= 50 * 1024 * 1024) {
        return res.send("solo 5MB");
    }

    req.files.target_file.mv(ruta, (err) => {
        if (err) {
            return res.send("algo saalio mal");
        }
        return res.redirect("/collage");
    });
});

app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        if (err) {
            res.send("fallo eliminar archivo");
        }
    });
    res.redirect("/collage");
});

app.listen(3000, () => console.log("Server ok"));
