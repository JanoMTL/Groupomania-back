
const jsonwebtoken = require ('jsonwebtoken')  
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
const fs = require ('fs')
const db = require('../models');
const {Op}= require('sequelize')


// Création d'un nouveau profile 

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


  // Connexion avec un profile existant 

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
            // Création  et envoi du Token 
            user: user,
            token: newToken.token,
            message: "Bonjour " + user.pseudo + " !",
          });
        }
      }
    
      return res.status(500).send({ error: "Erreur serveur" });
    }
  
// Affichage des détails d'un Profile

    exports.getOneProfile = async (req, res) => {
        // on retourne le profile correspondant à l'ID de la barre d'addresse 
        
          const user = await db.User.findOne({
            where: { id: req.params.id },
          });
          res.status(200).send(user);

          return res.status(500).send({ error: "Erreur serveur" });
        
      };

// Affichage de tous les profiles 

      exports.getAllProfile = async (req, res) => {

          const users = await db.User.findAll({
            attributes: ["pseudo", "id", "photo", "email"],
            where: {
              id: {
                [Op.ne]: 1,
              },
            },
          });
          res.status(200).send(users);
       
          return res.status(500).send({ error: "Erreur serveur" });
        
      };

      // Modification d'un profil 

      exports.updateProfile = async (req, res) => {
        let newPic;
        const id = req.params.id;
        if (!id){
            res.status(400).json({ message: 'mauvaise requète'})
        }
                  
          let user = await db.User.findOne({ where: { id: id } }); // sélection du bon utilisateur 
          if (id === user.id) {
            if (user.photo) {
                // Définition du nom de l'URL de la photo 
              newPic = `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`;
              const filename = user.photo.split("/images")[1];
              // suppression de la photo existante (si il yen a une)
              fs.unlink(`images/${filename}`, (err) => {
                if (err) res.status(400).json({ message: "Impossible de modifier la photo" });
                else {
                  console.log(`image supprimée !`);
                }
              });
            } else if (req.file) {
              newPic = `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`;
            }
            // si la photo est modifiée : mise à jour de la photo 
            if (newPic) {
              user.photo = newPic;
            }
            // si le pseudo est modifié : mise à jour du pseudo
            if (req.body.pseudo) {
              user.pseudo = req.body.pseudo;
            }

            // Sauvegarde des modifications dans la base de données
            const UserModified = await user.save({ fields: ["pseudo", "photo"] }); // Sauvegarde des modifications dans la base de données
            res.status(200).json({
              user: UserModified,
              message: "Votre profil a été modifié avec succés !",
            });
          } else {
            res
              .status(400)
              .json({ message: "Opération impossible !" });
          }
      };
    

      exports.deleteProfile = async (req, res) => {
        
          const id = req.params.id;
        

          const user = await db.User.findOne({ where: { id: id } });    
    
          // si il y a une photo au profil : on supprime la photo +  le profil
          if (user.photo !== null) {
            const filename = user.photo.split("/images")[1];
            fs.unlink(`images/${filename}`, () => {
              db.User.destroy({ where: { id: id } });
              res.status(200).json({ messageRetour: "Votre compte à été supprimé" });
            });
          } else {
            db.User.destroy({ where: { id: id } }); // on supprime le profil
            res.status(200).json({ message: "utilisateur supprimé" });
          }
        
          return res.status(500).send({ error: "problème serveur" });
      
      };
    