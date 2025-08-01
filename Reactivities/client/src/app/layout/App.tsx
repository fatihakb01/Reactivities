import { Box, Container, CssBaseline } from "@mui/material";
import NavBar from "./NavBar";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import HomePage from "../../features/home/HomePage";

// The Outlet component will find the route and the corresponding component 
function App() {
  const location = useLocation();

  return (
    <Box sx={{bgcolor: '#eeeeee', minHeight: '100vh'}}>
        <ScrollRestoration />
        <CssBaseline /> 
        {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container maxWidth='xl' sx={{mt: 3}}>
            <Outlet />             
          </Container>
        </>
      )}
    </Box>
  )
}

export default App
