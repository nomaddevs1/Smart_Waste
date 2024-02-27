import {
    Flex,
    IconButton,
    useDisclosure,
    Modal,
    ModalContent,
    Box,
    useColorMode,
    useColorModeValue,
    Button
} from "@chakra-ui/react"
import { Link, useNavigate } from 'react-router-dom';
//@ts-ignore
import {ReactComponent as Logo} from 'src/assets/header_logo.svg';

function Header(){
    const { colorMode, toggleColorMode } = useColorMode();
    const {isOpen, onOpen, onClose} = useDisclosure()

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
        >   
      
        </Flex>
    );
}

export default Header