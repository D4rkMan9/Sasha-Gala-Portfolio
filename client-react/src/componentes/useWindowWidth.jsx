import { useState, useEffect } from 'react';

const useWindowWidth = () => {
  const [width, setWidth] = useState(0); // Initialize with 0 or window.innerWidth on mount

  useEffect(() => {
    // Handler to update the width state
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this runs once on mount and unmount

  return width;
};

export default useWindowWidth;
