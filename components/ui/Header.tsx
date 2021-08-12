import React from 'react';
import { Box, Heading, Link, Themed } from 'theme-ui';

const Header = (props) => (
  <Box as="header" sx={{ pt: 4 }}>
    <Heading sx={{ fontSize: 4, pb: 4, px: [3, 4], fontWeight: 'heading' }} as="h1">
      <Link href={'/'} color="text">
        ♾️ loophole letters
      </Link>
    </Heading>
  </Box>
);

export default Header;
