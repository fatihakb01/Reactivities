import { Button, styled, type ButtonProps } from '@mui/material';
import { type LinkProps } from 'react-router';

/**
 * Combines Material UI ButtonProps with react-router LinkProps when the link is used as a component.
 */
type StyledButtonProps = ButtonProps & {
  to?: LinkProps['to'];
  variant: ButtonProps['variant']
};

/**
 * A custom Material UI button component with specific styling for a disabled state.
 * It can also be used as a navigation link via the 'to' prop.
 * @param {StyledButtonProps} props - The props for the component.
 * @returns {JSX.Element} The StyledButton component.
 */
const StyledButton = styled(Button)<StyledButtonProps>(({ theme }) => ({
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.text.disabled,
  },
}));

export default StyledButton;
