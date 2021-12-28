import React from 'react';

const Header = (props) => (
  <header className="sticky top-0 bg-blue-900 font-semibold p-2 text-white flex justify-center">
    <div className="max-w-3xl w-full text-right p-2">
      <h1 className="text-3xl">
        <a href={'/'}>∞ loophole letters</a> {/* ♾️ */}
      </h1>
    </div>
  </header>
);

export default Header;
