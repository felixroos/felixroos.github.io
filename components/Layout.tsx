import theme from './theme';
import { Box } from 'theme-ui';
import Head from './Head';
import ThemeToggle from './ui/ThemeToggle';
import Header from './ui/Header';
import Footer from './ui/Footer';

const Layout = (props) => {
  return (
    <>
      <Head {...props} />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          margin: 'auto',
          position: 'relative',
          maxWidth: 800,
        }}
      >
        {typeof theme.colors.modes === 'object' && <ThemeToggle />}
        <Header />
        <Box
          as="main"
          sx={{
            px: [3, 4],
            pb: 0,
          }}
        >
          {props.children}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
