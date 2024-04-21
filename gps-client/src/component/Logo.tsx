import { Box, Text } from "@chakra-ui/react";
import {ReactComponent as LogoIcon} from '../assets/logo.svg';

export const  Logo = (props: any) => {
  return (
    <Box {...props} display="flex" alignItems="center">
      <LogoIcon width="45px" height="45px"/>
      <Text ml="10px" fontSize="2xl" fontWeight="bold">
        Smart Waste
      </Text>
    </Box>
  );
}