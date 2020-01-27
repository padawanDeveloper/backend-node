"use strict";

const path = require("path");
const fs = require("fs");

const User = require("../models/user");
const Follow = require("../models/follow");

function saveFollow(req, res) {
  const params = req.body;
  const follow = new Follow();

  follow.user = req.user.sub;
  follow.followed = params.followed;

  follow.save((err, followStore) => {
    if (err) return res.status(500).send({ message: "Error al guardar" });
    if (!followStore)
      return res.status(404).send({ message: "No se pudo guardar" });
    return res.status(200).send({ follow: followStore });
  });
}

function deleteFollow(req, res) {
  const userId = req.user.sub;
  const followId = req.params.id;

  Follow.find({ user: userId, followed: followId }).remove(err => {
    if (err) return res.status(500).send({ message: "Error al eliminar" });
    return res.status(200).send({ message: "Follow eliminado" });
  });
}

function getFollowingUser(req, res) {
  let userId = req.user.sub;
  let page = 1;

  if (req.params.id) {
    userId = req.params.id;
  }

  if (req.params.page) {
    page = req.params.page;
  }

  const options = {
    page: page,
    limit: 10,
    populate: "followed"
  };

  Follow.paginate({ user: userId }, options, (err, follows) => {
    if (err) return res.status(500).send({ message: "Error en la peticion" });
    if (follows.docs.length == 0)
      return res.status(404).send({ message: "No hay follows" });
    return res.status(200).send(follows);
  });
}

function getFollowedUser(req, res) {
  let userId = req.user.sub;
  let page = 1;

  if (req.params.id) {
    userId = req.params.id;
  }

  if (req.params.page) {
    page = req.params.page;
  }

  const options = {
    page: page,
    limit: 10,
    populate: "user followed"
  };

  Follow.paginate({ followed: userId }, options, (err, follows) => {
    if (err) return res.status(500).send({ message: "Error en la peticion" });
    if (follows.docs.length == 0)
      return res.status(404).send({ message: "No hay followed" });
    return res.status(200).send(follows);
  });
}
module.exports = {
  deleteFollow,
  saveFollow,
  getFollowingUser,
  getFollowedUser
};
