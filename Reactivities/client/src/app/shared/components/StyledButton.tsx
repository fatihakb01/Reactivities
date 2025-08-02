import { Button, styled, type ButtonProps } from '@mui/material';
import { type LinkProps } from 'react-router';

// Combine MUI ButtonProps with LinkProps when Link is used as component
type StyledButtonProps = ButtonProps & {
  to?: LinkProps['to'];
  variant: ButtonProps['variant']
};

// Apply your custom styles to the styled button
const StyledButton = styled(Button)<StyledButtonProps>(({ theme }) => ({
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.text.disabled,
  },
}));

export default StyledButton;
