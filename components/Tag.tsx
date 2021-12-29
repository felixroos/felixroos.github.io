import React from 'react';

// className="mb-1 mr-2 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
const Tag = ({ children }) => (
  <div className="text-sm  bg-slate-200 dark:bg-slate-700 rounded-md p-2 font-serif text-slate-900 dark:text-white">
    {children}
  </div>
);

export default Tag;
