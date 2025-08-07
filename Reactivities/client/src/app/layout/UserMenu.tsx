import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Avatar, Box, ListItemIcon, ListItemText } from '@mui/material';
import { useAccount } from '../../lib/hooks/useAccount';
import { Add, Logout, Person } from '@mui/icons-material';
import { Link } from 'react-router';

/**
 * UserMenu component
 * -------------------
 * Renders a menu button in the navigation bar that shows the current user's name and avatar.
 * When clicked, it opens a dropdown menu with navigation and action items.
 *
 * Features:
 * - Displays the `currentUser`'s display name and an avatar.
 * - Opens a Material-UI `Menu` anchored to the button.
 * - Provides quick links to:
 *    - Create a new activity (`/createActivity`)
 *    - View the user's profile (`/profile`)
 * - Allows the user to log out via the `logoutUser` mutation.
 *
 * Internal State:
 * - `anchorEl`: Tracks the anchor element for the menu. Used to open/close the menu.
 *
 * Dependencies:
 * - `useAccount` hook to access `currentUser` and `logoutUser`.
 * - MUI components for UI elements (`Button`, `Menu`, `MenuItem`, `Avatar`, etc.).
 * - `react-router`'s `Link` for navigation.
 */
export default function UserMenu() {
  const {currentUser, logoutUser} = useAccount()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        color='inherit'
        size='large'
        sx={{fontSize: '1.1rem'}}
      >
        <Box display='flex' alignItems='center' gap={2}>
            <Avatar 
              src={currentUser?.imageUrl}
              alt='current user image'
            />
            {currentUser?.displayName}
        </Box>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem component={Link} to='/createActivity' onClick={handleClose}>
            <ListItemIcon>
                <Add />
            </ListItemIcon>
            <ListItemText>Create Activity</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to={`/profiles/${currentUser?.id}`} onClick={handleClose}>
            <ListItemIcon>
                <Person />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
            logoutUser.mutate();
            handleClose();
        }}>
            <ListItemIcon>
                <Logout />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
