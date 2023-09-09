const express = require('express');
const cors = require('cors');
const axios = require('axios'); 

const app = express();
const port = 4000; 

app.use(cors());

app.get('/metrics', async (req, res) => {
  try {
    const prometheusURL = 'http://91.208.92.6:3000/';
    const response = await axios.get(prometheusURL); 
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    res.status(500).send('Error fetching Prometheus metrics');
  }
});
app.get('/api/stats', async (req, res) => {
  try {
    const api = 'https://mainnet.mindscan.info/api/v2/stats';
    const response = await axios.get(api); 
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    res.status(500).send('Error fetching Prometheus metrics');
  }
});
app.get('/api/txn', async (req, res) => {
  try {
    const txn = 'https://mainnet.mindscan.info/api/v2/main-page/transactions';
    const response = await axios.get(txn); 
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    res.status(500).send('Error fetching Prometheus metrics');
  }
});
app.get('/api/block', async (req, res) => {
  try {
    const txn = 'https://mainnet.mindscan.info/api/v2/main-page/blocks';
    const response = await axios.get(txn); 
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    res.status(500).send('Error fetching Prometheus metrics');
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
