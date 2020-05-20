const Place = require('../models/Place');
const placeCtrl = {};

placeCtrl.createPlace = async (req, res) => {
  const { title, description, address } = req.body;
  const { userLoggedId } = req;

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
      message: error,
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
      message: error,
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
      message: error,
    });
  }
};

placeCtrl.deletePlace = async (req, res) => {
  const { id } = req.params;

  try {
    await Place.findById(id);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'The place id does not exist',
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
      message: error,
    });
  }
};

module.exports = placeCtrl;
