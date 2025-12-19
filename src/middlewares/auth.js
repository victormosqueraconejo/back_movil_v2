import jwt from 'jsonwebtoken';
import Usuario from '../routes/models/usuarios.js';

// Middleware para verificar el token JWT
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no provisto o formato inválido (use Bearer <token>)' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Buscar el usuario en base al sub (id) del token
    const user = await Usuario.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado para este token' });
    }

    // Adjuntar info del usuario a la request
    req.user = {
      _id: user._id,
      username: user.username,
      rol: user.rol
    };

    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(500).json({ message: 'Error interno de autenticación' });
  }
};


