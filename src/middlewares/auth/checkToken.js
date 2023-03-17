import jwt from 'jsonwebtoken';

class authUser {
  static checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided.' })
    }

    const parts = authHeader.split(" ");

    if (!(parts.length === 2)) {
      return res.status(401).json({ message: 'Token error.' })
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/.test(scheme)) {
      return res.status(401).json({ message: 'Token malformatted.' })
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided.' })
    }

    try {
      const secret = process.env.SECRET;

      jwt.verify(token, secret)
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.' })
    }
  }

  static rolePermissions(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(" ")[1];


    try {
      const decodedToken = jwt.decode(token)
      const role = decodedToken?.role
      if (role === 'admin') {
        next()
      } else {
        return res.status(403).json({ message: 'Você deve ter privilégios de admin para executar a ação.' })
      }
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.' })
    }

  }
}

export default authUser;