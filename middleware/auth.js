const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                message: 'No se proporcionó token de autenticación'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expirado'
            });
        }
        return res.status(401).json({
            message: 'Token inválido'
        });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                message: 'Usuario no autenticado'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                message: 'No tiene permisos para acceder a este recurso'
            });
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    checkRole
}; 