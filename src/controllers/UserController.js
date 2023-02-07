import User from '../models/User.js'

class UserController {

  static getUser = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id, '-password')

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' })
    }

    res.status(200).json({ user })
  }

  static getAllUsers = async (req, res) => {
    let { name } = req.query;

    const query = name ? { 'name': name } : null;

    User.find(query)
      .exec((err, users) => {
        if (users.length == 0) {
          return res.status(404).send({ message: "Não localizamos nenhum usuário, verifique se os parâmetros estão corretos." });
        }
        res.status(200).json(users);
      })
  }

  static deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id, (err, user) => {
      if (err) {
        return res.status(400).send({ message: err.message })
      }

      if (!user) {
        return res.status(404).send({ message: "Item não encontrado, verifique se os parâmetros estão corretos." })
      }

      res.status(200).send({ message: "Usuário removido com sucesso." })
    })
  }
}

export default UserController;