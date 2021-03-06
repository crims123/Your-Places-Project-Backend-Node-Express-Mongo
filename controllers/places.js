const Place = require('../models/Place');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const deleteFile = require('../utils/deleteFile');
const getCoordsForAddress = require('../utils/location');
const placeCtrl = {};

placeCtrl.createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    deleteFile(req.file);
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
      deleteFile(req.file);
      return res.status(422).json({
        success: false,
        message: 'A place with same address already exist',
      });
    }
  } catch (error) {
    deleteFile(req.file);
    res.status(500).json({
      success: false,
      message: 'Fetching place failed, please try again.',
    });
  }

  let coordinates;
  try {
    const data = await getCoordsForAddress(address);

    if (!data || data.status === 'ZERO_RESULTS') {
      deleteFile(req.file);
      return res.status(404).json({
        success: false,
        message: 'Could not find coordinates for the specified address.',
      });
    }

    coordinates = data.features[0].center;
  } catch (error) {
    deleteFile(req.file);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch address coordinates.',
    });
  }

  try {
    const place = new Place({
      title,
      description,
      image: req.file.path,
      address,
      location: {
        lat: coordinates[0],
        lng: coordinates[1],
      },
      creator: userLoggedId,
    });

    const user = await User.findById(userLoggedId);

    if (!user) {
      deleteFile(req.file);
      return res.status(404).json({
        success: false,
        message: 'Could not find user for provided id.',
      });
    }

    await place.save();
    user.places.push(place);
    await user.save();

    res.status(201).json({
      sucess: true,
      message: 'Place created',
    });
  } catch (error) {
    deleteFile(req.file);
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

    if (!place) {
      res.status(404).json({
        success: false,
        message: 'Could not find place for the provided id.',
      });
    }

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
};

placeCtrl.getPlacesByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const userPlaces = await Place.find({ creator: id });
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
};

placeCtrl.updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Invalid inputs passed, please check your data',
    });
  }

  const { title, description, address } = req.body;
  const { id } = req.params;
  const { userLoggedId } = req;

  try {
    const place = await Place.findById(id);

    if (!place) {
      res.status(404).json({
        success: false,
        message: 'Could not find a place for the provided user id.',
      });
    }

    if (String(place.creator) !== String(userLoggedId)) {
      res.status(401).json({
        success: false,
        message: 'You are not allowed to edit this place',
      });
    }

    await Place.findByIdAndUpdate(id, { title, description, address });
    res.json({
      success: true,
      message: 'Place updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong, could not update the place.',
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

    if (String(place.creator) !== String(userLoggedId)) {
      res.status(401).json({
        success: false,
        message: 'You are not allowed to delete this place.',
      });
    }

    try {
      const user = await User.findById(userLoggedId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Could not find user for delete place.',
        });
      }

      user.places.pull(place);
      await user.save();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'We could not delete place from user.',
      });
    }

    await Place.findByIdAndDelete(id);
    const file = { path: place.image };
    deleteFile(file);

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
