const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: {
                message: 'Error de validación',
                details: errors.array()
            }
        });
    }
    next();
};

// Validaciones comunes
const commonValidations = {
    idValidation: (field) => ({
        in: ['params'],
        errorMessage: `El ${field} debe ser un número válido`,
        isInt: true,
        toInt: true
    }),
    
    stringValidation: (field, minLength = 2, maxLength = 100) => ({
        in: ['body'],
        errorMessage: `El campo ${field} debe ser una cadena válida`,
        isString: true,
        trim: true,
        isLength: {
            options: { min: minLength, max: maxLength },
            errorMessage: `El campo ${field} debe tener entre ${minLength} y ${maxLength} caracteres`
        }
    })
};

module.exports = {
    validateRequest,
    commonValidations
}; 