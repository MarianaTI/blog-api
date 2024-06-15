import User from "../../models/user.js";

// Get all
export const getAll = async (req, res) => {
  try {
    const users = await User.find();

    const userFilter = users.map((user) => ({
      _id: user._id,
      username: user.username,
      email: user.email,
    }));

    const response = {
      users: userFilter,
      total: userFilter.length,
    };

    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Get by id
export const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const userFilter = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.status(200).json({ users: userFilter });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Updated
export const updateUser = async (req, res) => {
  try {
    const data = await req.body;
    const { id } = req.params;

    if (!data.username || (!data.email && !data.password)) {
      return res
        .status(400)
        .json({ messege: "Debe haber un campo para actualizar" });
    }

    const updateUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updateUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ user: updateUser });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

// Delete
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};
