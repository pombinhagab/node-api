const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/cadastro", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    bcrypt.hash(req.body.senha_usuario, 10, (errBcrypt, hash) => {
      if (errBcrypt) {
        return res.status(500).send({ error: errBcrypt });
      }

      conn.query(
        `INSERT INTO usuarios (email_usuario, senha_usuario) VALUES (?, ?)`,
        [req.body.email_usuario, hash],
        (error, result, field) => {
          conn.release();

          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              return res.status(409).send({
                mensagem: "E-mail já cadastrado. Tente outro e-mail.",
              });
            }
            return res.status(500).send({ error: error });
          }

          const response = {
            mensagem: "Usuário criado com sucesso",
            usuarioCriado: {
              id_usuario: result.insertId,
              email_usuario: req.body.email_usuario,
            },
          };

          return res.status(201).send(response);
        }
      );
    });
  });
});

router.post("/login", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const query = `SELECT * FROM usuarios WHERE email_usuario = ?`;
    conn.query(query, [req.body.email_usuario], (error, results, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error });
      }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: "Falha na autenticação" });
      }
      bcrypt.compare(
        req.body.senha_usuario,
        results[0].senha_usuario,
        (err, result) => {
          if (err) {
            return res.status(401).send({ mensage: "Falha na autenticação" });
          }
          if (result) {
            const token = jwt.sign(
              {
                id_usuario: results[0].id_usuario,
                email_usuario: results[0].email_usuario,
              },
              "process.env.JWT_KEY",
              {
                expiresIn: "1h",
              }
            );
            return res
              .status(200)
              .send({ mensagem: "Autenticado com sucesso", token: token });
          }
          return res.status(401).send({ mensagem: "Falha na autenticação" });
        }
      );
    });
  });
});

module.exports = router;
