
const jsonwebtoken = require ('jsonwebtoken')  
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
const db = require('../models');
const {Op}= require('sequelize')

exports.signUp = async (req, res) => {
    
      const user = await db.User.findOne({
        where: { [Op.or]:[{email: req.body.email},{pseudo: req.body.pseudo}] },
      });
      if (user !== null) {
          return res.status(403).json({ error: "identifiant dejà pris" });
  
      } else {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = await db.User.create({
          pseudo: req.body.pseudo,
          email: cryptojs.HmacSHA256(req.body.email, 'secretemail').toString(), 
          password: hash,
          admin: false,
            });
            return res.status(201).json({})
       
      }
  };

  exports.login = async (req, res) => {
    
    const cryptedResearchedEmail = cryptojs.HmacSHA256(req.body.email, 'secretemail').toString();
      const user = await db.User.findOne({
        where: { email: cryptedResearchedEmail },
      }); // on vérifie que l'adresse mail figure bien dan la bdd
      if (user === null) {
          console.log(user)
        return res.status(403).send({ error: "Connexion échouée" });
      } else {
        const hash = await bcrypt.compare(req.body.password, user.password); // on compare les mots de passes
        if (!hash) {
          return res.status(401).send({ error: "Mot de passe incorrect !" });
        } else {
            const newToken = jsonwebtoken.sign(
                { userId: user.id },
                'secrettoken',
                { expiresIn: '1h' }
            );
          res.status(200).send({
            // on renvoie le user et le token
            user: user,
            token: newToken.token,
            message: "Bonjour " + user.pseudo + " !",
          });
        }
      }
    
      return res.status(500).send({ error: "Erreur serveur" });
    }
  
