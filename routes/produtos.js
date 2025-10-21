const express = require('express');
const router = express.Router();


// retorna todos os produtos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Retorna os produtos"
    });
});

// insere um produto
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Insere um produto"
    });
});

// retorna os dados de um produto
router.get('/:idProduto', (req, res, next) => {
    const id = req.params.idProduto;

    if (id === 'especial') {
        res.status(200).send({
            mensagem: "Voce descobriu o ID especial",
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: "Voce passou um ID qualquer",
            id: id
        });
    }

    res.status(200).send({
        mensagem: "Usando o GET de um produto exclusivo",
        id: id
    });
});

// altera um produto
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Atualiza um produto"
    });
});

// deleta um produto
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Deleta um produto"
    });
});

module.exports = router;