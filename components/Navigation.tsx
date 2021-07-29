import Link from 'next/link';
import React from 'react';

const Navigation = (): JSX.Element => {
  return (
    <nav>
      <Link href="/">
      <a className="text-steelblue-900 pr-6 pb-2">
        <h1 className="m-0 p-0 font-extrabold">
          Loophole Letters
        </h1></a>
      </Link>
      {/* <Link href="/about">
        <a className="text-gray-900 dark:text-white px-6 py-4">About</a>
      </Link> */}
    </nav>
  );
};

export default Navigation;
