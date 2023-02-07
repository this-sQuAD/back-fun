
class Cors {
  static handleCors(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin, Accept, Authorization, Access-Control-Allow-Origin, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    );

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS');
      return res.status(200).send({})
    }
    next();
  }
}

export default Cors;