const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");

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

module.exports = router;
