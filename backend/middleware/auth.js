const jwt = require("jsonwebtoken");
require('dotenv').config();

// Récupère le token de la requête entrante (implémenter dans mes routes principales)

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //On vérifie
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    //Récupère l'id du token
    const userId = decodedToken.userId;
    // Compare l' utlisateur Id de la requête à celui du token si non valable ou bien sinon on continue
    if (req.body.userId && req.body.userId !== userId) {
      throw "Utilisateur id non valable !";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Requête invalide!"),
    });
  }
};
