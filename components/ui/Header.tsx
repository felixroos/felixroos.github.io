import React from 'react';

const Header = (props) => (
  <header className="z-[1999] sticky top-0 bg-slate-900 font-semibold p-2 text-white flex justify-center shadow-xl border-b border-gray-500">
    <div className="max-w-3xl w-full text-right p-2">
      <h1 className="text-3xl">
        <a href={'/'}>∞ loophole letters</a> {/* ♾️ */}
      </h1>
    </div>
  </header>
);

export default Header;
