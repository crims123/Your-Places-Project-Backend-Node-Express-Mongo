const Place = require('../models/Place');
const { validationResult } = require('express-validator');
const placeCtrl = {};

placeCtrl.createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Invalid inputs passed, please check your data',
    });
  }

  const { title, description, address } = req.body;
  const { userLoggedId } = req;

  try {
    const uniqueAddress = await Place.find({ address: address });
    if (uniqueAddress.length) {
      return res.status(422).json({
        success: false,
        message: 'A place with same address already exist',
      });
    }

    const uniqueTitle = await Place.find({ title: title });
    if (uniqueTitle.length) {
      return res.status(422).json({
        success: false,
        message: 'A place with same title already exist',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Fetching place failed, please try again.',
    });
  }

  const place = new Place({
    title,
    description,
    image:
      'https://worldstrides.com/wp-content/uploads/2015/07/iStock_000040849990_Large.jpg',
    address,
    location: {
      lat: 21,
      lng: 23,
    },
    creator: userLoggedId,
  });

  try {
    await place.save();
    res.status(201).json({
      sucess: true,
      message: 'Place created',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Creating place failed, please try again.',
    });
  }
};

placeCtrl.getPlaceById = async (req, res) => {
  const { id } = req.params;

  try {
    const place = await Place.findById(id);
    res.json({
      sucess: true,
      message: 'Place by id',
      data: place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong, could not find a place.',
    });
  }

  if (!place) {
    res.status(404).json({
      success: false,
      message: 'Could not find place for the provided id.',
    });
  }
};

placeCtrl.getUserPlaces = async (req, res) => {
  const { userLoggedId } = req;

  try {
    const userPlaces = await Place.find({ creator: userLoggedId });
    res.json({
      sucess: true,
      message: 'User Places',
      data: userPlaces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Fetching places failed, please try again later.',
    });
  }

  if (!userPlaces.length) {
    res.status(404).json({
      success: false,
      message: 'Could not find places for the provided user id.',
    });
  }
};

placeCtrl.deletePlace = async (req, res) => {
  const { id } = req.params;
  const { userLoggedId } = req;

  try {
    const place = await Place.findById(id);

    if (!place) {
      res.status(404).json({
        success: false,
        message: 'Could not find place for this id.',
      });
    }

    if (place.creator !== userLoggedId) {
      res.status(401).json({
        success: false,
        message: 'You are not allowed to delete this place.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong, could not delete place.',
    });
  }

  try {
    await Place.findByIdAndDelete(id);
    res.json({
      sucess: true,
      message: 'Place deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong, could not delete place.',
    });
  }
};

module.exports = placeCtrl;
