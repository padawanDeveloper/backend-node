"use strict";
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const jwt = require("../services/jwt");
const User = require("../models/user");
const Follow = require("../models/follow");
const Work = require("../models/work");

// Routes
function home(req, res) {
  res.status(200).send({ message: "Hello World with Express" });
}

function pruebas(req, res) {
  res.status(200).send({ message: "Hello World with Express" });
}

function saveUser(req, res) {
  const params = req.body;
  const user = new User();
  if (
    params.name &&
    params.email &&
    params.password &&
    //params.rol &&
    params.socialUrl
  ) {
    user.name = params.name;
    user.email = params.email;
    user.password = params.password;
    user.role = "ROLE_USER";
    user.socialUrl = params.socialUrl;

    User.find({ email: user.email.toLowerCase() }).exec((err, users) => {
      if (err) return res.status(500).send({ message: "error en la peticion" });
      if (users && users.length >= 1)
        return res.status(200).send({ message: "El email ya existe" });
    });

    bcrypt.hash(params.password, 10, (err, hash) => {
      user.password = hash;
      user.save((err, userStored) => {
        if (err) return res.status(500).send({ message: "error al guardar" });
        if (userStored) {
          res.status(200).send({ user: userStored });
        } else {
          res.status(400).send({ message: "No se ha registrado el usuario" });
        }
      });
    });
  } else {
    res.status(200).send({ message: "Rellenar datos" });
  }
}

function loginUser(req, res) {
  const params = req.body;
  const email = params.email;

  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send({ message: "Error en la peticion" });
    if (user) {
      bcrypt.compare(params.password, user.password, (err, check) => {
        if (check) {
          if (params.gettoken) {
            return res.status(200).send({ token: jwt.createToken(user) });
          } else {
            user.password = undefined;
            return res
              .status(200)
              .send({ user: user, token: jwt.createToken(user) });
          }
        } else {
          return res.status(404).send({ message: "Error en la password" });
        }
      });
    } else {
      return res.status(400).send({ message: "Error en la peticion" });
    }
  });
}

function getUser(req, res) {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send({ message: "Error en la peticion" });
    if (!user) return res.status(404).send({ message: "El usuario no existe" });
    followThisUser(req.user.sub, userId).then(value => {
      return res
        .status(200)
        .send({ user, following: value.following, followed: value.followed });
    });
  });
}

async function followThisUser(identity_user_id, user_id) {
  const following = await Follow.findOne({
    user: identity_user_id,
    followed: user_id
  })
    .exec()
    .then(follow => follow)
    .catch(err => handleHerror(err));

  const followed = await Follow.findOne({
    user: user_id,
    followed: identity_user_id
  })
    .exec()
    .then(follow => follow)
    .catch(err => handleHerror(err));

  return { following: following, followed: followed };
}

async function followUserIds(user_id) {
  const following = await Follow.find({ user: user_id })
    .select({
      _id: 0,
      __v: 0,
      user: 0
    })
    .exec()
    .then(follows => follows);

  const followed = await Follow.find({ followed: user_id })
    .select({
      _id: 0,
      __v: 0,
      followed: 0
    })
    .exec()
    .then(follows => follows);

  const following_clean = [];
  following.forEach(follow => following_clean.push(follow.followed));

  const followed_clean = [];
  followed.forEach(follow => followed_clean.push(follow.user));

  return { following: following_clean, followed: followed_clean };
}

//TODO: Re estructurar objeto result
function getUsers(req, res) {
  const identity_user_id = req.user.id;
  const page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  const options = {
    page: page,
    limit: 10
  };

  User.paginate({}, options, (err, result) => {
    const users = result.docs;
    if (err) return res.status(500).send({ message: "Error en la peticion" });
    if (users.length == 0)
      return res.status(404).send({ message: "No hay usuarios" });

    followUserIds(identity_user_id).then(value => {
      return res.status(200).send({
        result,
        users_following: value.following,
        users_follow_me: value.followed
      });
    });
  });
}

function updateUser(req, res) {
  const userId = req.params.id;
  const update = req.body;
  delete update.password;

  if (userId != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tienes permiso para actualizar este usuario" });
  }

  User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
    if (err) return res.status(500).send({ message: "Error en la peticion" });
    if (!userUpdated)
      return res
        .status(404)
        .send({ message: "No se ha podido actualizar el usuario" });
    return res.status(200).send({ user: userUpdated });
  });
}

function uploadImage(req, res) {
  const userId = req.params.id;

  if (req.files) {
    const file_path = req.files.image.path;
    const file_split = file_path.split("/");
    const file_name = file_split[2];
    const ext_split = file_name.split(".");
    const file_ext = ext_split[1];

    if (userId != req.user.sub) {
      return removeFilesOfUpload(
        res,
        file_path,
        "No tienes permiso para actualizar este usuario"
      );
    }

    if (
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg" ||
      file_ext == "gif"
    ) {
      //Actualizar documento de usuario logueado
      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        { new: true },
        (err, userUpdated) => {
          if (err)
            return res.status(500).send({ message: "Error en la peticion" });
          if (!userUpdated)
            return res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          return res.status(200).send({ user: userUpdated });
        }
      );
    } else {
      return removeFilesOfUpload(res, file_path, "Extension no valida");
    }
  } else {
    return res.status(200).send({ message: "No se han subido imagenes" });
  }
}

function removeFilesOfUpload(res, filePath, message) {
  fs.unlink(filePath, () => {
    return res.status(200).send({ message });
  });
}

function getImageFile(req, res) {
  const image_file = req.params.imageFile;
  const path_file = "./uploads/users/" + image_file;

  fs.exists(path_file, exist => {
    if (exist) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "No existe la imagen" });
    }
  });
}

function getCount(req, res) {
  let userId = req.user.sub;
  if (req.params.id) {
    userId = req.params.id;
  }

  getCountFollow(userId).then(value => res.status(200).send(value));
}

async function getCountFollow(userId) {
  const following = await Follow.count({ user: userId })
    .exec()
    .then(count => count)
    .catch(err => handleHerror(err));

  const followed = await Follow.count({ followed: userId })
    .exec()
    .then(count => count)
    .catch(err => handleHerror(err));

  const works = await Work.count({ author: userId })
    .exec()
    .then(count => count)
    .catch(err => handleHerror(err));

  return { following, followed, works };
}

module.exports = {
  home,
  loginUser,
  saveUser,
  pruebas,
  getImageFile,
  getUser,
  getUsers,
  updateUser,
  uploadImage,
  getCount
};
