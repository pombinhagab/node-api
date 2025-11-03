const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// retorna todos os produtos
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM produtos;", (error, result, field) => {
      conn.release(); // sempre liberar
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantidade: result.length,
        produtos: result.map((prod) => ({
          id_produto: prod.id_produto,
          nome_produto: prod.nome_produto,
          preco_produto: prod.preco_produto,
          request: {
            tipo: "GET",
            descricao: "Retorna os detalhes de um produto específico",
            url: "http://localhost:3000/produtos/" + prod.id_produto,
          },
        })),
      };
      return res.status(200).send(response);
    });
  });
});

// insere um produto
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO produtos (nome_produto, preco_produto) VALUES (?, ?)",
      [req.body.nome_produto, req.body.preco_produto],
      (error, result, field) => {
        conn.release(); // liberar conexão sempre
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Produto inserido com sucesso",
          produtoCriado: {
            id_produto: result.id_produto,
            nome_produto: req.body.nome_produto,
            preco_produto: req.body.preco_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3000/produtos",
            },
          },
        };
        res.status(201).send(response);
      }
    );
  });
});

// retorna os dados de um produto
router.get("/:id_produto", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM produtos WHERE id_produto = ?",
      [req.params.id_produto],
      (error, result, field) => {
        conn.release(); // liberar conexão sempre
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado um produto com esse ID",
          });
        }
        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome_produto: result[0].nome_produto,
            preco_produto: result[0].preco_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3000/produtos",
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

// altera um produto
router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "UPDATE produtos SET nome_produto = ?, preco_produto = ? WHERE id_produto = ?",
      [req.body.nome_produto, req.body.preco_produto, req.body.id_produto],
      (error, result, field) => {
        conn.release(); // liberar conexão sempre
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Produto atualizado com sucesso",
          produtoAtualizado: {
            id_produto: req.body.id_produto,
            nome_produto: req.body.nome_produto,
            preco_produto: req.body.preco_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um produto específico",
              url: "http://localhost:3000/produtos/" + req.body.id_produto,
            },
          },
        };
        res.status(202).send(response);
      }
    );
  });
});

// deleta um produto
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE FROM produtos WHERE id_produto = ?",
      [req.body.id_produto],
      (error, result, field) => {
        conn.release(); // liberar conexão sempre
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Produto removido com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere um produto",
            url: "http://localhost:3000/produtos",
            body: {
              nome_produto: "String",
              preco_produto: "Number",
            },
          },
        };
        res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
