// Aumentar el timeout para las pruebas
jest.setTimeout(10000);

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Silenciar los console.log durante las pruebas
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}; 