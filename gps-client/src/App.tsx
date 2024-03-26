import { Flex } from "@chakra-ui/react";
import { Navigate, Route, Routes} from 'react-router-dom';
import LoginPane from "./pages/Login";
import Role from "./pages/Role";
import Header from "./component/header";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./context/UserAuthContext";
import NotFound from "./pages/404";
import Map from "./pages/Map";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapProvider } from "./context/MapContext";

function App() {
  const {  isAuthenticated } = useAuth()!;
  const mapKey = `${process.env.REACT_APP_MAPS_API_KEY}`;

  const render = (status: Status): any => {
    if (status === Status.SUCCESS) return;
    return null;
  };

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
        <Route path="/map" element={
          <ProtectedRoute>
          <Wrapper render={render} apiKey={mapKey} libraries={["marker"]}>
            <MapProvider>
              <Map />
            </MapProvider>
          </Wrapper>
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
