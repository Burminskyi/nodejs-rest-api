const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");

  res.json(result);
};

const getContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findById(id);

  if (!result || owner.toString() !== result.owner.toString()) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOneAndRemove({ _id: id, owner });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({ message: "delete success" });
};

const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContact: ctrlWrapper(getContact),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
