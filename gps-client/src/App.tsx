import { Flex } from "@chakra-ui/react";
import { Navigate, Route, Routes} from 'react-router-dom';
import LoginPane from "./pages/Login";
import Role from "./pages/Role";
import Header from "./component/header";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./context/UserAuthContext";
import NotFound from "./pages/404";


function App() {
  const {  isAuthenticated } = useAuth()!;
  
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
