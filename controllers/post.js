const db = require("../models"); 
const fs = require("fs"); //
const multer =require('multer');
const tokenId = require('../middlewares/tokenId')


exports.getAll = async (req, res) => {
    
      const posts = await db.Post.findAll({
        attributes: ["id", "message", "imageUrl", "link", "createdAt"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            attributes: ["pseudo", "id", "photo"],
          },
                  
        ],
      });
      res.status(200).send(posts);
    
  };


  exports.getOne = async (req, res) => {
    
      const post = await db.Post.findOne({
        
        where: { id: req.params.id },
        include: [
          {
            model: db.User,
            attributes: ["pseudo", "photo", "id"],
          },
         
        ],
      });
      res.status(200).json(post);
   
    
};

exports.createOne = async (req, res) => {
    
    let image;
    
      const user = await db.User.findOne({
        attributes: ["pseudo", "id", "photo"],
        where: { id: req.params.id },
      });
      if (user !== null) {
        if (req.file) {
          image = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
        } else {
          image = null;
        }
        const post = await db.Post.create({
          include: [
            {
              model: db.User,
              attributes: ["pseudo", "photo", "id"],
            },
          ],
          message: req.body.message,
          link: req.body.link,
          image: image,
          UserId: user.id,
        });
  
        res
          .status(201)
          .json({ post: post, message: "Post créé avec succés" });
      } else {
        res.status(400).send({ error: "Erreur " });
      }
    
      return res.status(500).send({ error: "Erreur serveur" });
    
  };
  exports.updateOne = async (req, res) => {

      const userId = req.body.userId;
      let newImage;
      
      let post = await db.Post.findOne({ where: { id: req.params.id } });
      if (userId === post.UserId) {
        if (req.file) {
          newImage = `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`;
          if (post.image) {
            const filename = post.image.split("/images")[1];
            fs.unlink(`images/${filename}`, (err) => {
              if (err) console.log(err);
              else {
                console.log(`Image supprimée !`);
              }
            });
          }
        }
        if (req.body.message) {
          post.message = req.body.message;
        }
        post.link = req.body.link;
        post.image = newImage;
        const modifiedPost = await post.save({
          fields: ["message", "link", "imageUrl"],
        });
        res.status(200).json({ modifiedPost: modifiedPost, message: "post modifié !" });
      } else {
        res.status(400).json({ message: "Opération impossible" });
      }
    
      return res.status(500).send({ error: "Erreur serveur" });
    
  };


  exports.deleteOne = async (req, res) => {
   
      const userId = tokenId.verifyId(req)
      const post = await db.Post.findOne({ where: { id: req.params.id } });
      console.log(userId);
      if (userId === post.UserId ) {
        if (post.imageUrl) {
          const filename = post.imageUrl.split("/images")[1];
          fs.unlink(`images/${filename}`, () => {
            db.Post.destroy({ where: { id: post.id } });
            res.status(200).json({ message: "Post supprimé" });
          });
        } else {
          db.Post.destroy({ where: { id: post.id } }, { truncate: true });
          res.status(200).json({ message: "Post supprimé" });
        }
      } else {
        res.status(400).json({ message: "Operation impossible" });
      }
  
      return res.status(500).send({ error: "Erreur serveur" });
    
  };
  
  