import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [colorMode, setColorMode] = useState('default');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // fade in animation
    setOpacity(1);
  }, []);

  return (
    <div
      style={{
        padding: 3,
        position: 'absolute',
        top: 0,
        right: 0,
        opacity,
        transition: 'opacity .25s ease-in-out',
      }}
    >
      <button
        style={{ backgroundColor: 'gray', padding: 1, fontSize: 0, cursor: 'pointer' }}
        onClick={() => {
          setColorMode(colorMode === 'default' ? 'dark' : 'default');
        }}
      >
        {colorMode === 'default' ? 'dark' : 'light'} mode
      </button>
    </div>
  );
};

export default ThemeToggle;
