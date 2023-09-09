import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const backendURL = 'http://localhost:4000/metrics';

const Chart = () => {
  const [handshakeMetrics, setHandshakeMetrics] = useState([]);
  const [connectionMetrics, setConnectionMetrics] = useState([]);
  const [protocolsReceivedMetrics, setProtocolsReceivedMetrics] = useState([]);
  const proxyURL = backendURL;

  useEffect(() => {
    fetch(proxyURL)
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const handshakeMetricsData = [];
        const connectionMetricsData = [];
        const protocolsReceivedMetricsData = [];

        lines.forEach((line) => {
          if (line.startsWith('libp2p_swarm_handshake_latency_seconds_bucket')) {
            const leMatch = /le="([\d.]+)"/.exec(line);
            const value = parseFloat(line.split(' ')[1]);

            if (leMatch && !isNaN(value)) {
              const le = parseFloat(leMatch[1]);
              handshakeMetricsData.push({ le, value });
            }
          } else if (line.startsWith('libp2p_swarm_connection_duration_seconds_bucket')) {
            const leMatch = /le="([\d.]+)"/.exec(line);
            const value = parseFloat(line.split(' ')[1]);

            if (leMatch && !isNaN(value)) {
              const le = parseFloat(leMatch[1]);
              connectionMetricsData.push({ le, value });
            }
          } else if (line.startsWith('libp2p_identify_protocols_received_bucket')) {
            const leMatch = /le="([\d.]+)"/.exec(line);
            const value = parseFloat(line.split(' ')[1]);

            if (leMatch && !isNaN(value)) {
              const le = parseFloat(leMatch[1]);
              protocolsReceivedMetricsData.push({ le, value });
            }
          }
        });

        setHandshakeMetrics(handshakeMetricsData);
        setConnectionMetrics(connectionMetricsData);
        setProtocolsReceivedMetrics(protocolsReceivedMetricsData);
      })
      .catch((error) => {
        console.error('Error fetching Prometheus metrics:', error);
      });
  }, []);

  return (
    <div>
      <small>Handshake Metrics</small>
      <div className="ml-[-30px]">

      <LineChart width={280} height={200} data={handshakeMetrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="le" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
      </div>

    <smal>Connection Metrics</smal>
    <div className="ml-[-30px]">

      <LineChart width={280} height={200} data={connectionMetrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="le" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </div>

      <small>Protocols Received Metrics</small>
      <div className="ml-[-30px]">

      <LineChart width={280} height={200} data={protocolsReceivedMetrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="le" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#ffc658" strokeWidth={2} />
      </LineChart>
      </div>
    </div>
  );
};

export default Chart ;
