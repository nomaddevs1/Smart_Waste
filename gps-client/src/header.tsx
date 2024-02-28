import { Text, Flex, Stack, Box, Button } from "@chakra-ui/react";
import { auth } from "./auth/firebase";
import { useNavigate } from "react-router-dom";

function Logo(props: any) {
  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold">
        Logo
      </Text>
    </Box>
  );
}

const MenuItem = ({ children, ...rest }: { children: any }) => {
  return (
    <Text display="block" {...rest}>
      {children}
    </Text>
  );
};

function Header() {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  }
  return (
    <Flex
      width="100%"
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
      height="80px"
      alignItems="center"
      pos="fixed"
      padding={{ base: "0 1rem", md: "0 6rem" }} // Adjusted padding for responsiveness
      boxShadow="0px 1px 2px  2px rgba(0, 0, 0, 0.13)"
      justifyContent="space-between" // This spreads the children across the container
    >
      <Logo
        w="100px"
        color={["white", "white", "primary.500", "primary.500"]}
      />
      <Stack
        spacing={8}
        align="center"
        justify="flex-end" // Ensure items are aligned to the end
        direction="row" // Items are always in a row for this layout
        pt={[4, 4, 0, 0]}
        flex={1} // Makes the Stack take up available space, pushing the logo and items to opposite ends
      >
        <MenuItem>Home</MenuItem>
        <MenuItem><Button  colorScheme='red' size='xs' onClick={handleSignOut}>SignOut</Button> </MenuItem>
        {/* You can add more MenuItems here */}
      </Stack>
    </Flex>
  );
}

export default Header;
