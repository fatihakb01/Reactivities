import { Group } from "@mui/icons-material";
import { Box, AppBar, Toolbar, Typography, Container, LinearProgress } from "@mui/material";
import MenuItemLink from "../shared/components/MenuItemLink";
import { useStore } from "../../lib/hooks/useStore";
import { Observer } from "mobx-react-lite";
import { useAccount } from "../../lib/hooks/useAccount";
import UserMenu from "./UserMenu";

// use rfc to create a React component
// use the sx to specify custom css
export default function NavBar() {
  const {uiStore} = useStore();
  const {currentUser} = useAccount();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{
          backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
          position: 'relative'
        }}>
        <Container maxWidth='xl'>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box>
                    <MenuItemLink to='/'>
                        <Group fontSize="large"/>
                        <Typography variant="h4" fontWeight='bold'>Reactivities</Typography>
                    </MenuItemLink>
                </Box>
                <Box sx={{display: 'flex'}}>
                    <MenuItemLink to='/activities'>
                            Activities
                    </MenuItemLink>
                    <MenuItemLink to='/counter'>
                            Counter
                    </MenuItemLink>
                    <MenuItemLink to='/errors'>
                            Errors
                    </MenuItemLink>
                </Box>
                <Box display='flex' alignItems='center'>
                  {currentUser ? (
                      <UserMenu />
                  ) : (
                    <>
                      <MenuItemLink to='/login'>Login</MenuItemLink>
                      <MenuItemLink to='/register'>Register</MenuItemLink>
                    </>
                  )}
                </Box>
            </Toolbar>
        </Container>
        
        <Observer>
          {() => uiStore.isLoading ? (
            <LinearProgress 
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4
              }}
            />
          ) : null}
        </Observer>

      </AppBar>
    </Box>
  )
}
