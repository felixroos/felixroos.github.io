import React from 'react';
import { Button } from 'theme-ui';

// className="mb-1 mr-2 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
const Tag = ({ children }) => (
  <Button sx={{ display: 'inline', mr: 1 }} variant="tag">
    {children}
  </Button>
);

export default Tag;
