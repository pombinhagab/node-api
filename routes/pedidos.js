const express = require('express');
const router = express.Router();


// retorna todos os pedidos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Retorna os pedidos"
    });
});

// insere um pedido
router.post('/', (req, res, next) => {

    const pedido = {
        idPedido: req.body.idPedido,
        quantidade: req.body.quantidade,
    }

    res.status(201).send({
        mensagem: "Insere um pedido",
        pedidoCriado: pedido
    });
});

// retorna os dados de um pedido
router.get('/:idProduto', (req, res, next) => {
    const id = req.params.idPedido
    res.status(200).send({
        mensagem: "Detalhes do pedido",
        idPedido: id
    });
});

// altera um pedido
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Pedido alterado"
    });
});

// deleta um pedido
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Pedido excluido"
    });
});

module.exports = router;