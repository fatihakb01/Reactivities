import { MenuItem } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router";

/**
 * A custom component that wraps a Material UI MenuItem with a NavLink from react-router.
 * It provides a consistent styling for navigation links and a visual "active" state.
 * @param {MenuItemLinkProps} props - The props for the component.
 * @returns {JSX.Element} The MenuItemLink component.
 */
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