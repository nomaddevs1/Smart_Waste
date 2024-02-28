import { Flex } from "@chakra-ui/react";
import Header from "./header";
import { Route, Routes} from 'react-router-dom';
import LoginPane from "./pages/Login";
import Role from "./pages/Role";


function App() {
  return (
    <Flex height="100vh" flexDirection="column" overflowY={'hidden'}>
      <Header/>
      <Routes>
        <Route path="/login"  element={<LoginPane/>} />
        <Route path="/roles"  element={<Role/>} />
        {/* Add more routes as needed */}
      </Routes>
   
    </Flex>
  )
}

export default App;
