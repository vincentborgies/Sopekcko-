// Utilisé pour télécharger des fichiers
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//  Multer implémente les téléchargements de fichiers, les utilisateurs télécharge les images d'articles à vendre
const storage = multer.diskStorage({
  // Destination des images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Nouveau nom fichier image pour éviter les doublons
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
