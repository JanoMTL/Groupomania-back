module.exports = (req,res,next) => {
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if(regexEmail.test(req.body.email)) {
      if(regexPassword.test(req.body.password)) {
          next();
      } else {
          res.status(400).json({ message: "Le mot de passe doit comporter au moins 8 caractères"
          + " et posséder au moins un chiffre, une lettre majuscule et une lettre minuscule "});
      }
  } else {
      res.status(400).json({ message: "Merci de renseigner une adresse email valide"});
  }
}