import { Flex, Stack, Button, Menu, MenuButton, MenuList, MenuItem as ChakraMenuItem, IconButton, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon, AddIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import data from "../auth/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";
import { Logo } from "./Logo";


function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const user = useAuth();
  const handleSignOut = async () => {
    await data.auth.signOut();
    navigate('/login');
  }
  return (
     <Flex
      width="100%"
      bg="blue.900"
      height="80px"
      alignItems="center"
      pos="fixed"
      zIndex="1000"
      padding={{ base: "0 1rem", md: "0 6rem" }}
      boxShadow="0px 1px 2px 2px rgba(0, 0, 0, 0.13)"
      justifyContent="space-between" 
    >
      <Logo w="100px" color="white" />
      
      {/* Display for larger screens */}
      <Stack
        spacing={8}
        align="center"
        justify="flex-end" 
        direction="row"
        display={{ base: "none", md: "flex" }}
      >
       
          <>
            <Button as={Link} to="/dashboard" variant="link" color="white">Dashboard</Button>
            <Button as={Link} to="/" variant="link" color="white">Map</Button>
            {user?.isAuthenticated ?<Button colorScheme='red' size='xs' onClick={handleSignOut}>Sign Out</Button>: <Button as={Link} to="/login" colorScheme="teal" color="white">Login/Signup</Button>}
          </>
    
      </Stack>

      {/* Hamburger menu for smaller screens */}
      <Menu isOpen={isOpen} onClose={onClose}>
        <MenuButton 
          as={IconButton} 
          icon={<HamburgerIcon />} 
          display={{ base: "flex", md: "none" }} // Only display on small screens
          onClick={onOpen} 
          colorScheme="blue"
          variant="outline"
          aria-label="Options"
        />
        <MenuList>
          <ChakraMenuItem icon={<AddIcon />} as={Link} to="/dashboard">
            Dashboard
          </ChakraMenuItem>
          <ChakraMenuItem icon={<ExternalLinkIcon />} as={Link} to="/">
            Map
          </ChakraMenuItem>
          {user?.isAuthenticated ? <ChakraMenuItem icon={<AddIcon />} onClick={handleSignOut}>
            Sign Out
          </ChakraMenuItem> : <ChakraMenuItem icon={<ExternalLinkIcon />} as={Link} to="/login">
            Login/Signup
          </ChakraMenuItem>
}
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default Header;
