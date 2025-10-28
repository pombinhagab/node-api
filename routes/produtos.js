const express = require('express');
const router = express.Router();
const mysql = require("../mysql").pool;


// retorna todos os produtos
router.get('/', (req, res, next) => {
    // res.status(200).send({
    //     mensagem: "Retorna os produtos"
    // });

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query("SELECT * FROM produtos;", (error,resultado, field) => {
            if (error) { return res.status(500).send({ error: error }) }
            return res.status(200).send({ response: resultado });
        });
    });
});

// insere um produto
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (nome_produto, preco_produto) VALUES (?, ?)',
            [req.body.nome_produto, req.body.preco_produto],
            (error, resultado, field) => {
                conn.release();       // importante liberar a conexao
                if (error) { return res.status(500).send({ error: error }) }

                res.status(201).send({
                    mensagem: "Produto inserido com sucesso",
                    id_produto: resultado.insertId
                });
            }
        )
    });
});

// retorna os dados de um produto
router.get('/:id_produtos', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            "SELECT * FROM produtos WHERE id_produtos = ?",
            [req.params.id_produtos],
            (error, resultado, field) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({response: resultado})
            }
        )
    })
});

// altera um produto
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            "UPDATE produtos SET nome_produto = ?, preco_produto = ? WHERE id_produtos = ?",
            [
            req.body.nome_produto,
            req.body.preco_produto,
            req.body.id_produtos
            ],
            (error, resultado, field) => {
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: "Produto alterado com sucesso",
                    id_produto: resultado.insertId
                })
            }
        )
    })
});

// deleta um produto
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            "DELETE FROM produtos WHERE id_produtos = ?",
            [req.body.id_produtos],
            (error, resultado, field) => {
                if (error) { return res.status(500).send({ error: error }) }

                res.status(202).send({
                    mensagem: "Produto removido com sucesso",
                    id_produto: resultado.insertId
                })
            }
        )
    })
});

module.exports = router;