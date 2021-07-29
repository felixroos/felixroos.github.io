import { useEffect } from 'react';

export default function useKeyHandler({ down, up, disabled }: any) {
  // Add event listeners
  useEffect(() => {
    if (disabled) {
      down = () => { };
      up = () => { };
    }
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [disabled]); // Empty array ensures that effect is only run on mount and unmount
}