const express = require('express');
const cors = require('cors');
const axios = require('axios'); 

const app = express();
const port = 4000; 

app.use(cors());

// Define a reusable error handler function
const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).send('An error occurred while fetching data');
};


const endpoints = {
  '/metrics': 'http://91.208.92.6:3000/',
  '/api/stats': 'https://mainnet.mindscan.info/api/v2/stats',
  '/api/txn': 'https://mainnet.mindscan.info/api/v2/main-page/transactions',
  '/api/txn/chart': 'https://mainnet.mindscan.info/api/v2/stats/charts/transactions',
  '/api/block': 'https://mainnet.mindscan.info/api/v2/main-page/blocks',
};

Object.entries(endpoints).forEach(([route, url]) => {
  app.get(route, async (req, res) => {
    try {
      const response = await axios.get(url);
      res.send(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

