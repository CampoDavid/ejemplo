const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Tutorías',
            version: '1.0.0',
            description: 'API para gestión de tutorías académicas'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            schemas: {
                Tutoria: {
                    type: 'object',
                    required: ['materia', 'fecha', 'cupos'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único de la tutoría'
                        },
                        materia: {
                            type: 'string',
                            description: 'Nombre de la materia'
                        },
                        descripcion: {
                            type: 'string',
                            description: 'Descripción detallada de la tutoría'
                        },
                        fecha: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha de la tutoría (YYYY-MM-DD)',
                            example: '2024-05-29'
                        },
                        cupos: {
                            type: 'integer',
                            minimum: 1,
                            description: 'Número de cupos disponibles'
                        },
                        profesor_id: {
                            type: 'integer',
                            description: 'ID del profesor que imparte la tutoría'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Mensaje de error'
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        tags: [
            {
                name: 'Tutorías',
                description: 'Operaciones relacionadas con tutorías'
            }
        ],
        paths: {
            '/api/tutorias': {
                post: {
                    tags: ['Tutorías'],
                    summary: 'Crear una nueva tutoría',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['materia', 'fecha', 'cupos'],
                                    properties: {
                                        materia: {
                                            type: 'string',
                                            example: 'Matemáticas'
                                        },
                                        descripcion: {
                                            type: 'string',
                                            example: 'Tutoría de cálculo diferencial'
                                        },
                                        fecha: {
                                            type: 'string',
                                            format: 'date',
                                            example: '2024-05-29',
                                            description: 'Fecha en formato YYYY-MM-DD'
                                        },
                                        cupos: {
                                            type: 'integer',
                                            minimum: 1,
                                            example: 5
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Tutoría creada exitosamente',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Tutoria'
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Datos inválidos',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Error'
                                    }
                                }
                            }
                        },
                        401: {
                            description: 'No autorizado'
                        },
                        403: {
                            description: 'No tiene permisos de profesor'
                        }
                    }
                }
            },
            '/api/tutorias/disponibles': {
                get: {
                    tags: ['Tutorías'],
                    summary: 'Obtener todas las tutorías disponibles',
                    responses: {
                        200: {
                            description: 'Lista de tutorías disponibles',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Tutoria'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api/tutorias/mis-tutorias': {
                get: {
                    tags: ['Tutorías'],
                    summary: 'Obtener las tutorías del profesor autenticado',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Lista de tutorías del profesor',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/Tutoria'
                                        }
                                    }
                                }
                            }
                        },
                        401: {
                            description: 'No autorizado'
                        },
                        403: {
                            description: 'No tiene permisos de profesor'
                        }
                    }
                }
            },
            '/api/tutorias/{id}': {
                put: {
                    tags: ['Tutorías'],
                    summary: 'Actualizar una tutoría existente',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer'
                            },
                            description: 'ID de la tutoría'
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        materia: {
                                            type: 'string',
                                            example: 'Matemáticas'
                                        },
                                        descripcion: {
                                            type: 'string',
                                            example: 'Tutoría actualizada de cálculo'
                                        },
                                        fecha: {
                                            type: 'string',
                                            format: 'date',
                                            example: '2024-05-30',
                                            description: 'Fecha en formato YYYY-MM-DD'
                                        },
                                        cupos: {
                                            type: 'integer',
                                            minimum: 1,
                                            example: 3
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Tutoría actualizada exitosamente',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Tutoria'
                                    }
                                }
                            }
                        },
                        404: {
                            description: 'Tutoría no encontrada'
                        }
                    }
                },
                delete: {
                    tags: ['Tutorías'],
                    summary: 'Eliminar una tutoría',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: {
                                type: 'integer'
                            },
                            description: 'ID de la tutoría'
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Tutoría eliminada exitosamente'
                        },
                        404: {
                            description: 'Tutoría no encontrada'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;