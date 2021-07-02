const tokenId = require('../middlewares/tokenId');


exports.likeOne = async (req, res, next) => {
    
      
      const userId = tokenId.verifyId(req);
      const postId = req.params.id; 
      const user = await db.Like.findOne({
        where: { UserId: user, PostId: postId },
      });
      if (user) {
        await db.Like.destroy(
          { where: { UserId: user, PostId: post } },
          { truncate: true, restartIdentity: true }
        );
        res.status(200).send({ message: "je n'aime plus" });
      } else {
        await db.Like.create({
          UserId: userId,
          PostId: postId,
        });
        res.status(201).json({ message: "j'aime" });
      }
    
      return res.status(500).send({ error: "Erreur serveur" });
    
  };