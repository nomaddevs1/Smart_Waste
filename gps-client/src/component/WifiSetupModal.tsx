import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
  VStack,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useBLEConnection } from "../hooks/useBLEConnection";
import FirestoreService from "../db/db";
import { useAuth } from "../context/UserAuthContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useGeocoding } from "../hooks/useGeocoding";

interface WifiSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

const WifiSetupModal: React.FC<WifiSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [ssid, setSsid] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const toast = useToast();
  const { userLocation} = useGeolocation()
  const { connectToBLEDevice } = useBLEConnection(toast);
  const { user } = useAuth()!;
  const modalBackground = useColorModeValue("white", "gray.700");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.300");
  const { getAddress } = useGeocoding(); 
  
  const handleSubmit = async () => {
    let lat = userLocation!.lat.toString()
    let lng = userLocation!.lng.toString()
    if (!ssid || !password) {
      toast({
        title: "Error",
        description: "Please enter your SSID and password.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    onClose();
    
    let serialNumber = await connectToBLEDevice(ssid, password);
    try {
      await FirestoreService.addBoard(serialNumber!, user!.uid!,lat, lng);
      toast({
        title: "New Board detected",
        description: "Board added",
        status: "success",
        isClosable: true,
      }); 
    }catch (e:any) {
      await FirestoreService.updateBoard(serialNumber!,user!.uid, {lat, lng})
      console.log(e);
        toast({
          title: "Board Already exists",
          description: e.message,
          status: "info",
          isClosable: true,
      })
    }
    getAddress(serialNumber!, lat, lng);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent backgroundColor={modalBackground}>
        <ModalHeader fontSize="lg" fontWeight="bold">
          WiFi Setup
        </ModalHeader>
        <IconButton
          aria-label="Close modal"
          icon={<CloseIcon />} // Alternatively, use React Icons: icon={<IoClose />}
          position="absolute"
          right={3}
          top={3}
          size="sm"
          onClick={onClose}
          variant="ghost"
        />
        <Divider orientation="horizontal" />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl id="wifi-ssid">
              <FormLabel>WiFi SSID</FormLabel>
              <Input
                placeholder="Enter your WiFi SSID"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                borderColor={inputBorderColor}
                _hover={{ borderColor: "blue.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
              />
            </FormControl>
            <FormControl id="wifi-password">
              <FormLabel>WiFi Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your WiFi password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderColor={inputBorderColor}
                _hover={{ borderColor: "blue.500" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px blue.500",
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <Divider orientation="horizontal" />
        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={handleSubmit}
            _hover={{ bg: buttonHoverBg }}
          >
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WifiSetupModal;
