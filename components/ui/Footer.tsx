const Footer = (props) => (
  <div className="py-4 font-serif bg-slate-400 flex justify-center items-center">
    <p className="leading-none">
      <a className="underline" href="https://github.com/felixroos">
        Felix Roos
      </a>{' '}
      {new Date().getFullYear()}
    </p>
  </div>
);

export default Footer;
