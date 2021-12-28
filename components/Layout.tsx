import Head from './Head';
import Header from './ui/Header';
import Footer from './ui/Footer';

const Layout = (props) => {
  return (
    <>
      <Head {...props} />
      <Header />
      <div className="flex justify-center min-h-full  py-4">
        {/* typeof theme.colors.modes === 'object' && <ThemeToggle /> */} {/* TODO: toggle dark mode */}
        <main className="max-w-3xl p-2">{props.children}</main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
