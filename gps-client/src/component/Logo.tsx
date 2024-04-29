import { Box, Text } from "@chakra-ui/react";
import {ReactComponent as LogoIcon} from '../assets/logo.svg';
import { useNavigate } from "react-router-dom";

export const  Logo = (props: any) => {
  const navigate = useNavigate()
  return (
    <Box {...props} display="flex" alignItems="center">
      <LogoIcon width="45px" height="45px" onClick={() => {navigate("/dashboard")}}/>
      <Text ml="10px" fontSize="2xl" fontWeight="bold">
        Smart Waste
      </Text>
    </Box>
  );
}