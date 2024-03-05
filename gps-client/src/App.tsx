import { Flex } from "@chakra-ui/react";
import { Route, Routes} from 'react-router-dom';
import LoginPane from "./pages/Login";
import Role from "./pages/Role";
import Header from "./component/header";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Flex height="100vh" flexDirection="column" overflowY={'hidden'}>
      <Header/>
      <Routes>
        <Route path="/login"  element={<LoginPane/>} />
        <Route path="/dashboard"  element={<Dashboard/>} />
        <Route path="/roles"  element={<Role/>} />
        {/* Add more routes as needed */}
      </Routes>
   
    </Flex>
  )
}

export default App;
