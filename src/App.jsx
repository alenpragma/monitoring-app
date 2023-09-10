import React from 'react';
import Monitoring from './pages/Monitoring';

const App = () => {
  return (
    <div className="relative">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://cdn.create.vista.com/api/media/medium/408482510/stock-video-blue-digital-wave-particles-motion-abstract-beautiful-bokeh-lights-background?token="
      >
        {/* Add additional source elements for different video formats if needed */}
      </video>
      <div className="relative z-10">
        <Monitoring />
      </div>
    </div>
  );
};

export default App;