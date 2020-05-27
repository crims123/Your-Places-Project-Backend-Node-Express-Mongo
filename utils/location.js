const axios = require('axios');

const getCoordsForAddress = async (address) => {
  const url = 'https://api.mapbox.com/geocoding/v5';
  const endpoint = 'mapbox.places';
  const searchText = encodeURIComponent(address);
  const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiY3JpbXMxMjMiLCJhIjoiY2thcHJ4dWRiMDJ1cDJ4bGd2dnJyd3JqMSJ9.SaqcnIsXanWsi3j2D7U8pw';

  const response = await axios(
    `${url}/${endpoint}/${searchText}.json/?access_token=${MAPBOX_ACCESS_TOKEN}`
  );

  return response.data;
};

module.exports = getCoordsForAddress;
