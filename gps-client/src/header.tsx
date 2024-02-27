import {
    Flex,
} from "@chakra-ui/react"

function Header(){

    return (
        <Flex 
            width="100%" 
            bg= {"#121212"} 
            height="80px" 
            alignItems="center" 
            pos="fixed" 
            padding=" 0 6rem" 
            boxShadow="0px 1px 2px  2px rgba(0, 0, 0, 0.13)" 
            justifyContent={{base: "center", md: "left"}}
            zIndex="1000"
        >   
      
        </Flex>
    );
}

export default Header