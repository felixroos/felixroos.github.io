import Head from './Head';
import Header from './ui/Header';
import Footer from './ui/Footer';

const Layout = (props) => {
  return (
    <>
      <Head {...props} />
      <Header />
      <div className="flex justify-center min-h-full dark:bg-slate-900 py-4">
        {/* typeof theme.colors.modes === 'object' && <ThemeToggle /> */} {/* TODO: toggle dark mode */}
        <main className="max-w-full overflow-auto sm:max-w-3xl p-2 break-words">{props.children}</main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
