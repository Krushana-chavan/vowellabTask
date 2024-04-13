import React from 'react';


const Loader = () => {
  const spinnerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Adjust as needed
  };

  const circularSpinnerStyle = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={spinnerContainerStyle}>
      <div style={circularSpinnerStyle}></div>
    </div>
  );
};

export default Loader;