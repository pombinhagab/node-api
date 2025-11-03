const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// retorna todos os pedidos
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT 
        pedidos.id_pedido,
        pedidos.quantidade_pedido,
        produtos.id_produto,
        produtos.nome_produto,
        produtos.preco_produto
      FROM pedidos
      INNER JOIN produtos
        ON produtos.id_produto = pedidos.id_produto;`,
      (error, result, field) => {
        conn.release(); // libera conexão sempre

        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          quantidade_pedidos_registrados: result.length,
          pedidos: result.map((ped) => {
            return {
              id_pedido: ped.id_pedido,
              quantidade_pedido: ped.quantidade_pedido,
              produto: {
                id_produto: ped.id_produto,
                nome_produto: ped.nome_produto,
                preco_produto: ped.preco_produto,
              },
              request: {
                tipo: "GET",
                descricao: "Retorna os detalhes de um pedido específico",
                url: "http://localhost:3000/pedidos/" + ped.id_pedido,
              },
            };
          }),
        };
        res.status(200).send(response);
      }
    );
  });
});

// insere um pedido
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      "SELECT * FROM pedidos WHERE id_pedido = ?",
      [req.body.id_pedido],
      (error, result, field) => {
        if (error) {
          conn.release();
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          conn.release();
          return res.status(404).send({
            mensagem: "Produto não encontardo",
          });
        }

        conn.query(
          "INSERT INTO pedidos (id_produto, quantidade_pedido) VALUES (?, ?)",
          [req.body.id_produto, req.body.quantidade_pedido],
          (error, result, field) => {
            conn.release(); // libera conexão
            if (error) {
              return res.status(500).send({ error: error });
            }
            const response = {
              mensagem: "Pedido inserido com sucesso",
              pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade_pedido: req.body.quantidade_pedido,
                request: {
                  tipo: "GET",
                  descricao: "Retorna todos os pedidos",
                  url: "http://localhost:3000/pedidos",
                },
              },
            };

            res.status(201).send(response);
          }
        );
      }
    );
  });
});

// retorna os dados de um pedido
router.get("/:id_pedido", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM pedidos WHERE id_pedido = ?",
      [req.params.id_pedido],
      (error, result, field) => {
        conn.release(); // libera conexão
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado um pedido com esse ID",
          });
        }
        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].id_produto,
            quantidade_pedido: result[0].quantidade_pedido,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os pedidos",
              url: "http://localhost:3000/pedidos",
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

// altera um pedido
router.patch("/", (req, res, next) => {
  res.status(201).send({
    mensagem: "Pedido alterado",
  });
});

// deleta um pedido
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE FROM pedidos WHERE id_pedido = ?",
      [req.body.id_pedido],
      (error, result, field) => {
        conn.release(); // libera conexão
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Pedido removido com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere um pedido",
            url: "http://localhost:3000/pedidos",
            body: {
              id_produto: "Number",
              quantidade_pedido: "Number",
            },
          },
        };

        res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
