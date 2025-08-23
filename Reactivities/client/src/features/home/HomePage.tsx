import { Group } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router";

/**
 * The main home page component for the application.
 *
 * This component serves as the landing page, providing a visually appealing
 * welcome message and a clear call to action to start using the app.
 *
 * Features:
 * - Displays the application title and a welcoming message.
 * - Uses a prominent gradient background and an icon for visual appeal.
 * - Provides a large button to navigate to the activities dashboard.
 * - Uses Material UI for all styling and layout.
 *
 * Example usage:
 * ```tsx
 * // Renders at the root path '/'
 * <HomePage />
 * ```
 */
export default function HomePage() {
  return (
    <Paper
      sx={{
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'
      }}
    >
      <Box sx={{
        display: 'flex', 
        alignItems: 'center', 
        alignContent: 'center',
        color: 'white', gap: 3
      }}>
        <Group sx={{height: 110, width: 110}}/>
        <Typography variant="h1">
          Reactivities  
        </Typography> 
      </Box>
      <Typography variant="h2">
        Welcome to reactivities
      </Typography>
      <Button
        component={Link}
        to='/activities'
        size="large"
        variant="contained"
        sx={{height: 80, borderRadius: 4, fontSize: '1.5rem'}}
      >
        Take me to the activities!
      </Button>
    </Paper>
  )
}