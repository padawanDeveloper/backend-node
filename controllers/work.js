"use strict";

const path = require("path");
const fs = require("fs");
const moment = require("moment");

const Work = require("../models/work");
const User = require("../models/user");
const Follow = require("../models/follow");
const Location = require("../models/location");

function saveWork(req, res) {
  const params = req.body;

  if (!params.description)
    return res.status(200).send({ message: "Debe tener descripcion" });
  const work = new Work();
  const location = new Location();

  work.name = params.name;
  work.description = params.description;
  work.type = params.type;
  work.author = req.user.sub;
  work.image = null;
  work.created_at = moment().unix();

  location.latitude = params.latitude;
  location.longitude = params.longitude;
  location.street = params.street;
  location.city = params.city;
  location.region = params.region;
  location.country = params.country;
  location.isoCountryCode = params.isoCountryCode;
  location.postalCode = params.postalCode;

  location.save((err, locationStore) => {
    if (err) return res.status(500).send({ message: "Error al guardar" });
    if (!locationStore)
      return res
        .status(404)
        .send({ message: "La locacion NO ha sido guardada" });

    work.location = locationStore;
    work.save((err, workStore) => {
      if (err) return res.status(500).send({ message: "Error al guardar" });
      if (!workStore)
        return res
          .status(404)
          .send({ message: "La publicacion NO ha sido guardada" });
      return res.status(200).send({ work: workStore });
    });
  });
}

function getWorks(req, res) {
  const identity_user_id = req.user.sub;
  const page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  const followOptions = {
    page: page,
    limit: 10,
    populate: "followed"
  };

  const workOptions = {
    page: page,
    limit: 10,
    populate: "user",
    sort: "-created_at"
  };

  Follow.paginate({ user: identity_user_id }, followOptions, (err, follows) => {
    if (err)
      return res.status(500).send({ message: "Error devolver seguidores" });

    const follows_clean = [];
    follows.docs.forEach(follow => {
      follows_clean.push(follow.followed);
    });

    Work.paginate(
      { user: { $in: follows_clean } },
      workOptions,
      (err, works) => {
        if (err)
          return res.status(500).send({ message: "Error devolver works" });
        if (works.docs.length == 0)
          return res.status(404).send({ message: "No hay trabajos" });
        return res.status(200).send(works);
      }
    );
  });
}

function getWork(req, res) {
  const workId = req.params.id;
  if (!workId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(500).send({ message: "Error id no valido" });
  }

  Work.findById(workId, (err, work) => {
    if (err) return res.status(500).send({ message: "Error" });
    if (!work) return res.status(404).send({ message: "No se encontro work" });
    return res.status(200).send(work);
  });
}

function deleteWork(req, res) {
  const workId = req.params.id;
  Work.find({ author: req.user.sub, _id: workId }).remove(
    (err, workRemoved) => {
      if (err) return res.status(500).send({ message: "Error" });
      if (!workRemoved)
        return res.status(404).send({ message: "No se elimino" });
      return res.status(200).send({ work: workRemoved });
    }
  );
}

function uploadImage(req, res) {
  const userId = req.params.id;

  if (req.files) {
    const file_path = req.files.image.path;
    const file_split = file_path.split("/");
    const file_name = file_split[2];
    const ext_split = file_name.split(".");
    const file_ext = ext_split[1];

    if (
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg" ||
      file_ext == "gif"
    ) {
      //Actualizar documento de work
      Work.findByIdAndUpdate(
        userId,
        { file: file_name },
        { new: true },
        (err, workUpdated) => {
          if (err)
            return res.status(500).send({ message: "Error en la peticion" });
          if (!workUpdated)
            return res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          return res.status(200).send({ user: workUpdated });
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
  const path_file = "./uploads/works/" + image_file;

  fs.exists(path_file, exist => {
    if (exist) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "No existe la imagen" });
    }
  });
}

module.exports = {
  deleteWork,
  getImageFile,
  getWorks,
  getWork,
  saveWork,
  uploadImage
};
