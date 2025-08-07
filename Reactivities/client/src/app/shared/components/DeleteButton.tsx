import { DeleteOutline, Delete } from "@mui/icons-material"
import { Box, Button } from "@mui/material"

/**
 * A styled delete button that combines two icons for a layered effect.
 *
 * Features:
 * - Shows a red delete icon over a white outline icon for visual emphasis.
 * - Commonly used for deleting a photo.
 *
 * @returns {JSX.Element}
 *
 * @example
 * <DeleteButton onClick={handleDelete} />
 */
export default function DeleteButton() {
  return (
    <Box sx={{position: 'relative'}}>
        <Button
            sx={{
                opacity: 0.8,
                transition: 'opacity 0.3s',
                position: 'relative',
                cursor: 'pointer'
            }}
        >
            <DeleteOutline 
                sx={{
                    fontSize: 32,
                    color: 'white',
                    position: 'absolute'
                }}
            />
            <Delete
                sx={{
                    fontSize: 28,
                    color: 'red'
                }}
            />
        </Button>
    </Box>
  )
}
