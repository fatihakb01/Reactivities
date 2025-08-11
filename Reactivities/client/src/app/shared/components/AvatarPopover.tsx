import * as React from 'react';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import { Avatar } from '@mui/material';
import { Link } from 'react-router';
import ProfileCard from '../../../features/profiles/ProfileCard';

type Props = {
    profile: Profile
}

/**
 * Displays a profile avatar that shows a preview popover on hover.
 *
 * Features:
 * - Renders the user's avatar with image and name.
 * - Opens a Material UI Popover on mouse hover to show profile details via `ProfileCard`.
 * - Popover appears below the avatar and disappears on mouse leave.
 * - Avatar also links to the user's full profile page.
 *
 * Props:
 * @param {Profile} profile - The profile to display in avatar and popover.
 *
 * Usage:
 * ```tsx
 * <AvatarPopover profile={attendee} />
 * ```
 */
export default function AvatarPopover({profile}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Avatar
              alt={profile.displayName + ' image'}
              src={profile.imageUrl}
              sx={{
                border: profile.following ? 3 : 0,
                borderColor: 'secondary.main'
              }}
              component={Link}
              to={`/profiles/${profile.id}`}
              onMouseEnter={handleClick}
              onMouseLeave={handleClose}
            />  
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
        }}
        onClose={handleClose}
        disableRestoreFocus
      >
        <ProfileCard profile={profile} />
      </Popover>
    </>
  );
}
