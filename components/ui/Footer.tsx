import { Box, Text, Themed } from 'theme-ui';

const Footer = (props) => (
  <Box
    sx={{
      p: 4,
      color: '#666',
      textAlign: 'center',
      fontSize: 1,
    }}
  >
    <Text sx={{ mx: 3, display: 'inline-block' }}>
      Created by <Themed.a href="https://github.com/felixroos">Felix Roos</Themed.a>
    </Text>
  </Box>
);

export default Footer;
