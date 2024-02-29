import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import WifiSetupModal from "../component/WifiSetupModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Button onClick={openModal} colorScheme="blue">
        Setup WiFi
      </Button>
      <WifiSetupModal isOpen={isModalOpen} onClose={closeModal} />
    </Flex>
  );
};

export default Dashboard;
