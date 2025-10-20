import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface RequestWithUserId extends Request {
  userId?: string;
}

// Interfaz que describe el contenido de nuestro token una vez decodificado
interface DecodedToken {
  id: string;
  username: string;
  csrf: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'anakena123';

export const authenticate = (req: RequestWithUserId, res: Response, next: NextFunction) => {
  try {
    // Obtener el token JWT de la cookie 'token'
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing, please log in' });
    }

    // Obtener el token CSRF del encabezado personalizado enviado por el cliente
    const csrfTokenFromHeader = req.headers['x-csrf-token'];
    if (!csrfTokenFromHeader) {
      return res.status(401).json({ error: 'CSRF token missing' });
    }

    // Verificar el token JWT
    const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decodedToken.csrf !== csrfTokenFromHeader) {
      return res.status(401).json({ error: 'Invalid CSRF token' });
    }

    // Ahora, cualquier ruta que use este middleware tendrá acceso a 'req.userId'
    req.userId = decodedToken.id;

    // La autenticación fue exitosa, pasamos al siguiente middleware o al controlador final
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    next(error);
  }
};

export { JWT_SECRET };
