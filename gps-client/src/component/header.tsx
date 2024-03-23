import { Flex, Stack,Button } from "@chakra-ui/react";
import data from "../auth/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";
import { Logo } from "./Logo";
import { MenuItem } from "./MenuItem";


function Header() {
  const navigate = useNavigate();
  const user = useAuth();
  const handleSignOut = async () => {
    await data.auth.signOut();
    navigate('/login');
  }
  return (
    <>
    <Flex
      width="100%"
      bg="blue.900"
      height="80px"
      alignItems="center"
      pos="fixed"
      zIndex={"1000"}
      padding={{ base: "0 1rem", md: "0 6rem" }}
      boxShadow="0px 1px 2px  2px rgba(0, 0, 0, 0.13)"
      justifyContent="space-between" 
    >
      <Logo
        w="100px"
        color="white"
      />
      <Stack
        spacing={8}
        align="center"
        justify="flex-end" 
        direction="row" 
        pt={[4, 4, 0, 0]}
        flex={1} 
      >
        {user?.isAuthenticated && (
          <>
            <Link to="/dashboard">
              <Button variant="link" color="white">Dashboard</Button>
            </Link>
            <Link color="white" to="/map">
              <Button variant="link" color="white">Map</Button>
            </Link>
            <MenuItem><Button colorScheme='red' size='xs' onClick={handleSignOut}>SignOut</Button> </MenuItem>
          </>
        )}
      </Stack>
      </Flex>
      </>
  );
}

export default Header;
