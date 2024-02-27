import { Flex } from "@chakra-ui/react";
import Header from "./header";

function App() {
  return (
    <Flex height="100vh" flexDirection="column" overflowY={'hidden'}>
      <Header />
    </Flex>
  )
}

export default App;
