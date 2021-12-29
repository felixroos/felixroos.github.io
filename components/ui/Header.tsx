import React from 'react';
import ThemeSwitch from '../layout/ThemeSwitch';

const Header = (props) => (
  <header className="z-[1999] sticky top-0 bg-slate-900 dark:bg-slate-800 font-semibold p-2 text-white flex justify-center shadow-xl border-b border-gray-500 dark:border-gray-800">
    <div className="max-w-3xl w-full p-2 flex justify-between items-center">
      <h1 className="text-3xl">
        <a href={'/'}>∞ loophole letters</a> {/* ♾️ */}
      </h1>
      <ThemeSwitch />
    </div>
  </header>
);

export default Header;
