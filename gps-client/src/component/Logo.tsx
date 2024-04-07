import { Box, Text } from "@chakra-ui/react";
import {ReactComponent as LogoIcon} from '../assets/bin_full.svg';

export const  Logo = (props: any) => {
  return (
    <Box {...props} display="flex" alignItems="center">
      <LogoIcon width="40px" height="40px"/>
      <Text ml="10px" fontSize="2xl" fontWeight="bold">
        Logo Name
      </Text>
    </Box>
  );
}