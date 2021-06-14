  
const bcrypt = require('bcrypt')
const token = require('../middlewares/token')
const db = require('../models');

exports.signUp = async (req, res) => {
    console.log(req.body)
    try {
      const user = await db.User.findOne({
        where: { email: req.body.email },
      });
      if (user !== null) {
        if (user.pseudo === req.body.pseudo) {
          return res.status(400).json({ error: "ce pseudo est déjà utilisé" });
        }
      } else {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = await db.User.create({
          pseudo: req.body.pseudo,
          email: req.body.email,
          password: hash,
          admin: false,
        });
  
        const brandNewToken = await token.giveToken(newUser);
        res.status(201).send({
          user: newUser,
          token: brandNewToken.token,
          expires: brandNewToken.expiresIn,
          message: `Votre compte est bien créé ${newUser.pseudo} !`,
        });
      }
    } catch (error) {
      return res.status(400).send({ error: "email déjà utilisé" });
    }
  };