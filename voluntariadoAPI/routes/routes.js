const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const {MONGO_URI} = require('../mongodb');
const Voluntario = require('../models/Voluntario');
const Instituicao = require('../models/Instituicao');
const { updateMany } = require('../models/Voluntario');
const client = new MongoClient(MONGO_URI);


//Schema voluntario
/**
 * @swagger
 * definitions:
 *   Voluntario:
 *     type: object
 *     properties:
 *       nome:
 *         type: string
 *       idade:
 *         type: number
 *       telefone: 
 *         type: number
 *       genero:
 *         type: string
 *     xml:
 *       name: Voluntario
 */

//Schema Instituicao
/**
 * @swagger
 * definitions:
 *   Instituicao:
 *     type: object
 *     properties:
 *       nome:
 *         type: string
 *       telefone:
 *         type: number
 *       morada:
 *         type: string
 *       tarefas:
 *         type: string
 *     xml:
 *       name: Instituicao
 */

//Adicionar um novo voluntario
/**
 * @swagger
 * paths:
 *   /addVoluntario:
 *     post:
 *       tags:
 *       - Voluntarios
 *       summary: Adicionar novo voluntario
 *       operationId: postVoluntario
 *       consumes:
 *       - application/json
 *       - application/xml
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: body
 *         name: body
 *         description: Adicionar um novo voluntario
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Voluntario'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.post('/addVoluntario', async (req, res) => {
    const newVoluntario = new Voluntario(req.body);
    try {
        const collection = await newVoluntario.save();
        if(!collection) throw Error('Something went wrong while saving the post');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Atualizar os dados de um voluntario
/**
 * @swagger
 * paths:
 *   /updateVoluntario/{Nome}:
 *     put:
 *       tags:
 *       - Voluntarios
 *       summary: Atualizar um voluntario
 *       operationId: updateVoluntario
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *         - in: path
 *           name: Nome
 *           type: string
 *           required: true
 *         - in: body
 *           name: body
 *           description: Atualizar um voluntario
 *           required: true
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.put('/updateVoluntario/:Nome', async (req, res) => {
    const query = req.params.Nome;
    const updtbody = req.body;
    Voluntario.findOne({nome: query}, function(err, registo){
        registo.nome=updtbody.nome
        registo.idade=updtbody.idade
        registo.telefone=updtbody.telefone
        registo.genero=updtbody.genero
        registo.save(function(err){
            if(err){
                throw err;
            }
        })
        res.status(200).json(registo);
    })
});

//Apagar um voluntario
/**
 * @swagger
 * paths:
 *   /deleteVoluntario/{nome}:
 *     delete:
 *       tags:
 *       - Voluntarios
 *       summary: Apagar um voluntario
 *       operationId: deleteVoluntario
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - name: nome
 *         in: "path"
 *         description: "Nome do voluntario que pretende apagar"
 *         required: true
 *         type: "string"
 *         schema:
 *           $ref: '#/definitions/Voluntario'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.delete('/deleteVoluntario/:nome', async (req, res) => {
    const nomes = req.params.nome;
    try {
        const collection = await Voluntario.findOneAndDelete({nome: nomes});
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Pesquisar voluntarios
/**
 * @swagger
 * paths:
 *   /searchVoluntarios:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Pesquisar voluntarios
 *       description: Lista de voluntarios
 *       operationId: getVoluntarios
 *       produces:
 *       - application/json
 *       - application/xml
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Lista vazia
 */
router.get('/searchVoluntarios', async (req, res) => {
    try {
        const collection = await Voluntario.find();
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Pesquisar voluntario pelo nome
/**
 * @swagger
 * paths:
 *   /SearchVoluntarioByName/{Nome}:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Pesquisar voluntario pelo nome
 *       description: Pesquisa de um voluntario pelo nome
 *       operationId: getVoluntarioPorNome
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: path
 *         name: Nome
 *         description: Nome do voluntario
 *         type: string
 *         required: true
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Nome nao encontrado
 */
router.get('/SearchVoluntarioByName/:Nome', async (req, res) => {
    const query = req.params.Nome;
    try {
        const collection = await Voluntario.find({nome: query});
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Contagem do numero de voluntarios
/**
 * @swagger
 * paths:
 *   /countVoluntarios:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Numero de voluntarios 
 *       description: Numero de voluntarios registados na base de dados
 *       operationId: getCountVoluntarios
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Nao existem voluntarios
 */
router.get('/countVoluntarios', async (req, res) => {  
    try{
        await client.connect();
        const database = client.db("test");
        const nvoluntarios = database.collection("voluntarios");
        const estimate = await nvoluntarios.estimatedDocumentCount();
        res.status(200).json(estimate);
    }finally {
        await client.close();
      }
});

//Pesquisar voluntarios por genero
/**
 * @swagger
 * paths:
 *   /voluntariosByGenero/{Genero}:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Pesquisar voluntarios por genero
 *       description: Pesquisar voluntarios por genero
 *       operationId: getVoluntariosByGender
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: path
 *         name: Genero
 *         description: Masculino/Feminino
 *         type: string
 *         required: true
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Nao existem voluntarios
 */
router.get('/voluntariosByGenero/:Genero', async (req, res) => {
    const query = req.params.Genero;
    Voluntario.find({genero: query}, function(err, registo){
        res.status(200).json(registo);
    })
});

//Adicionar nova instituicao
/**
 * @swagger
 * paths:
 *   /addInstituicao:
 *     post:
 *       tags:
 *       - Instituicao
 *       summary: Adicionar nova instituicao
 *       operationId: postInstituicao
 *       consumes:
 *       - application/json
 *       - application/xml
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: body
 *         name: body
 *         description: Introduzir os dados da instituicao 
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Instituicao'
 *       responses:
 *         405:
 *           description: Invalid input
 */
router.post('/addInstituicao', async (req, res) => {
    const newInstituicao = new Instituicao(req.body);
    try {
        const collection = await newInstituicao.save();
        if(!collection) throw Error('Something went wrong while saving the post');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Atualizar os dados de uma instituicao
/**
 * @swagger
 * paths:
 *   /updateInstituicao/{Nome}:
 *     put:
 *       tags:
 *       - Instituicao
 *       summary: Atualizar uma instituicao
 *       operationId: updateInstituicao
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: path
 *         name: Nome
 *         description: "Nome da instituicao que pretende atualizar"
 *         required: true
 *         type: "string"
 *       - in: body
 *         name: body
 *         description: Atualizar uma instituicao
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Instituicao'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.put('/updateInstituicao/:Nome', async (req, res) => {
    const query = req.params.Nome;
    const updtbody = req.body;
    Instituicao.findOne({nome: query}, function(err, registo){
        registo.nome=updtbody.nome
        registo.morada=updtbody.morada
        registo.telefone=updtbody.telefone
        registo.tarefas=updtbody.tarefas
        registo.save(function(err){
            if(err){
                throw err;
            }
        })
        res.status(200).json(registo);
    })
});

//Apagar uma instituicao
/**
 * @swagger
 * paths:
 *   /deleteInstituicao/{nome}:
 *     delete:
 *       tags:
 *       - Instituicao
 *       summary: Apagar uma instituicao
 *       operationId: deleteInstituicao
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: path
 *         name: nome
 *         description: "Nome da instituicao que pretende apagar"
 *         required: true
 *         schema:
 *           type: string
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.delete('/deleteInstituicao/:nome', async (req, res) => {
    const delNome = req.params.nome;
    try {
        const collection = await Instituicao.findOneAndDelete({nome: delNome});
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Adicionar uma tarefa para uma instituicao
/**
 * @swagger
 * paths:
 *   /addTarefa/{nome}:
 *     put:
 *       tags:
 *       - Instituicao
 *       summary: Adicionar uma tarefa para uma instituicao
 *       operationId: addTarefa
 *       consumes:
 *       - application/json
 *       - application/xml
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: path
 *         name: nome
 *         description: "Instituicao onde pretende adicionar a tarefa"
 *         required: true
 *         type: string
 *       - in: path
 *         name: tarefas
 *         description: "Tarefa que pretende adicionar"
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Instituicao'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.put('/addTarefa/:nome', async (req, res) => {
    const query = req.params.nome;
    const newtarefas = req.parms.tarefas;
    console.log(newtarefas);
    Instituicao.findOne({nome: query}, function(err, registo){
        registo.tarefas=newtarefas
        registo.save(function(err){
            if(err){
                throw err;
            }
        })
        res.status(200).json(registo);
    })
        /*
    try {
        const collection = await Instituicao.findOneAndUpdate({tarefa: newtarefas});
        if(!collection) throw Error('Something went wrong while saving the post');
        collection.tarefas = newtarefas;
        collection.save();
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    } */
});

//Pesquisar Instituicoes
/**
 * @swagger
 * paths:
 *   /searchInstituicao:
 *     get:
 *       tags:
 *       - Instituicao
 *       summary: Pesquisar instituicoes
 *       description: Lista de todos as instituicoes 
 *       operationId: getLocalVoluntariado
 *       produces:
 *       - application/json
 *       - application/xml
 *       responses:
 *         '200':
 *           description: sucess
 *           schema:
 *             $ref: '#/definitions/Instituicao'
 *         '500':
 *           description: error
 */
router.get('/searchInstituicao', async (req, res) => {
    try {
        const collection = await Instituicao.find();
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Pesquisar instituicao por nome
/**
 * @swagger
 * paths:
 *   /getInstituicaoByName/{Nome}:
 *     get:
 *       tags:
 *       - Instituicao
 *       summary: Pesquisar instituicao por nome
 *       description: Pesquisar instituicao por nome
 *       operationId: getInstituicaoByNome
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: path
 *         name: Nome
 *         type: string
 *         required: true
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Instituicao'
 *         '500':
 *           description: Nao existe nenhum instituicao com esse nome
 */
router.get('/getInstituicaoByName/:Nome', async (req, res) => {
    const query = req.params.Nome;
    try {
        const collection = await Instituicao.find({nome: query});
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Numero de instituicoes
/**
 * @swagger
 * paths:
 *   /countInstituicoes:
 *     get:
 *       tags:
 *       - Instituicao
 *       summary: Numero de instituicoes
 *       description: Numero de instituicoes 
 *       operationId: getCountInstituicoes
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Instituicao'
 *         '500':
 *           description: Nao existem instituicoes
 */
router.get('/countInstituicoes', async (req, res) => { 
    try{
        await client.connect();
        const database = client.db("test");
        const ninstituicaos = database.collection("instituicaos");
        const estimate = await ninstituicaos.estimatedDocumentCount();
        res.status(200).json(estimate);
    }finally {
        await client.close();
      }
});

module.exports = router;
