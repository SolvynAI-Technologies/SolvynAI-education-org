import React from 'react';

interface LoaderProps {
  onAnimationEnd: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onAnimationEnd }) => {
  return (
    <div className="loader-container" onAnimationEnd={onAnimationEnd}>
      <img src="/logo.png" alt="Loader" className="loader-image" />
    </div>
  );
};

export default Loader;