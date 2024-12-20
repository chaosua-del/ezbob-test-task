import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.airtable.com/v0/appx3rIOqt3A3k2aE/',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
  },
});

export default instance;
