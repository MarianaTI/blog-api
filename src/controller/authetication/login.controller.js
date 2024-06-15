import User from "../../models/user.js";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const responseData = await User.create({
      username,
      email,
      password,
    });
    res.send({ data: responseData });
  } catch (error) {
    console.error("Error interno del servidor: ", error);
    return res.status(500).json({ Error: error });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password)
      return res.status(400).json({ messege: "the field is empty" });

    const userFound = await User.findOne({ email: req.body.email });

    if (!userFound)
      return res
        .status(400)
        .json({ messege: "email or password is incorrect" });

    if (password != userFound.password)
      return res
        .status(400)
        .json({ messege: "email or password is incorrect" });
    
    const token = jwt.sign({id: userFound._id, username: userFound.username}, "process.env.SECRET_KEY", {
      expiresIn: 3600 // 1 hora
    });

    // Destructurar que quiero mostrar
    return res.status(200).json({
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      token // Enviar token
    });
  } catch (error) {
    console.error("Error interno del servidor: ", error);
    return res.status(500).json({ Error: error });
  }
};
