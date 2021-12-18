const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "acceso denegado" });
  try {
    //token = token.replace("Bearer ", "");
    console.log(token);
    const verificar = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.TOKEN_SECRET
    );
    req.user = verificar;
    next();
  } catch (error) {
    res
      .status(400)
      .json({ error: "token no es válido", error2: error.message });
  }
};
module.exports = verifyToken;
