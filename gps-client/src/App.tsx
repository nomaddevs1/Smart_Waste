import { Flex } from "@chakra-ui/react";
import { Navigate, Route, Routes} from 'react-router-dom';
import LoginPane from "./pages/Login";
import Role from "./pages/Role";
import Header from "./component/header";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./context/UserAuthContext";
import NotFound from "./pages/404";

import Map from "./components/map";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

function App() {
  const {  isAuthenticated } = useAuth()!;
  
  const center = { lat: 33.2101, lng: -97.1490 };
  const zoom = 15;

  const render = (status: Status): any => {
    if (status === Status.SUCCESS) return;
    return null;
  };

  const apiKey = `${process.env.REACT_APP_GOOGLE_API_KEY}`;

  return (
    <Flex height="100vh" flexDirection="column" overflowY={'hidden'} >
      <Header/>
      <Routes>
        <Route path="/login"  element={<LoginPane/>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/roles" element={
          <ProtectedRoute>
            <Role />
          </ProtectedRoute>} />
                {/* Redirect unauthenticated users to /login, and authenticated users to /dashboard */}
        <Route path="/" element={isAuthenticated ? <Navigate replace to="/dashboard" /> : <Navigate replace to="/login" />} />
        {/* Catch-all route */}
        <Route path="*" element={<NotFound/>} />

      </Routes>
   
    </Flex>
  )
}

export default App;
