import { MenuItem } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router";

// Provide some styling when an item in the navbar is selected/ is active
// children are the sub-components of the MenuItem
export default function MenuItemLink({children, to}: {children: ReactNode, to: string}) {
  return (
    <MenuItem
        component={NavLink}
        to={to}
        sx={{
            fontSize: '1.2rem',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: 'inherit',
            '&.active': {
                color: '#dcdcdc'
            }
        }}
    >
        {children}
    </MenuItem>
  )
}