import axios from 'axios';

// Client-side decoupling logic interacting with Google Places web service streams
export const getGeocodedCoordinates = async (address) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('System map initialization variables are missing.');
  
  const encodedAddress = encodeURIComponent(address);
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
  );
  
  if (response.data.status !== 'OK') {
    throw new Error(`Geocoding failed with status: ${response.data.status}`);
  }
  
  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng, formattedAddress: response.data.results[0].formatted_address };
};
