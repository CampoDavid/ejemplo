import swaggerAutogen from 'swagger-autogen';

const outputFile ='./swagger.json';
const endPointsFiles = ['../server.js'];

const doc = {
    info:{
        title:'API de Gestión de Tutorías',
        description: 'Esta API permite gestionar las tutorías, reservas y usuarios de un sistema educativo.'
    },
    host:'localhost:3000',
    schemes:['http']
}

swaggerAutogen()(outputFile,endPointsFiles, doc);