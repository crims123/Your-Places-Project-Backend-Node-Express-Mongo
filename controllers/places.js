const Place = require('../models/Place');
const placeCtrl = {};

placeCtrl.createPlace = async (req, res) => {
  const { title, description, address } = req.body;

  const place = new Place({
    title,
    description,
    image: 'https://worldstrides.com/wp-content/uploads/2015/07/iStock_000040849990_Large.jpg',
    address,
    location: {
       lat: 21,
       lng: 23,
    },
    creator: 'crims'
  });

  try {
    await place.save();
    res.status(201).json({
      sucess: true,
      message: 'Place created'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error
    });
  }
 
};

module.exports = placeCtrl;
