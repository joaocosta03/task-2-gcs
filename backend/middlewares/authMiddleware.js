const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: 'Token não fornecido.' });

  const parts = authHeader.split(' ');

  if (parts.length !== 2)
    return res.status(401).json({ error: 'Token malformado.' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ error: 'Token malformado.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // agora você pode usar req.user.email, req.user.id etc
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
