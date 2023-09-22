const Footer = (props) => (
  <div className="py-4 font-serif bg-slate-900 dark:bg-slate-800 text-white flex justify-center items-center">
    <p className="leading-none">
      ❤️ {new Date().getFullYear()}{' '}
      <a className="underline" href="https://github.com/felixroos">
        Felix Roos
      </a>{' '}
      |{' '}
      <a rel="me" href="https://post.lurk.org/@froos">
        mastodon
      </a>{' '}
      |{' '}
      <a rel="me" href="https://github.com/felixroos/">
        github
      </a>
    </p>
  </div>
);

export default Footer;
