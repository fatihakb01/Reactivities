import { AccessTime, Place } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material"
import { Link } from "react-router";
import { formatDate } from "../../../lib/util/util";
import AvatarPopover from "../../../app/shared/components/AvatarPopover";

type Props = {
    activity: Activity;
}

/**
 * Renders a card displaying summary information about an activity.
 *
 * Features:
 * - Displays the activity's title, host, date, venue, and description.
 * - Shows chips if the user is hosting, attending, or if the activity is cancelled.
 * - Includes a list of attendees as avatars with popover previews.
 * - Provides a "View" button that links to the activity's detail page.
 *
 * Props:
 * @param {Activity} activity - The activity object containing all display info.
 *
 * Usage:
 * ```tsx
 * <ActivityCard activity={activity} />
 * ```
 */
export default function ActivityCard({activity}: Props) {
  const label = activity.isHost ? 'You are hosting' : 'You are going';
  const color = activity.isHost ? 'secondary' : activity.isGoing ? 'warning' : 'default';

  return (
    <Card elevation={3} sx={{borderRadius: 3}}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <CardHeader
          avatar={<Avatar sx={{height: 80, width: 80}} />}
          title={activity.title}
          slotProps={{
            fontWeight: 'bold',
            fontSize: 20
          }}  
          subheader={
            <>
              Hosted by{' '} 
              <Link to={`/profiles/${activity.hostId}`}>
                {activity.hostDisplayName}
              </Link>
            </>
          }
        />
        <Box display='flex' flexDirection='column' gap={2} mr={2}>
          {(activity.isHost || activity.isGoing) && <Chip variant="outlined" label={label} color={color} sx={{borderRadius: 2}}/>}
          {activity.isCancelled && <Chip label='Cancelled' color='error' sx={{borderRadius: 2}}/>}
        </Box>

      </Box>

      <Divider sx={{mb: 3}} />

        <CardContent>
          <Box display='flex' alignItems='center' mb={2} px={2}>
            <Box display='flex' flexGrow={0} alignItems='center'>
              <AccessTime sx={{mr: 1}} />
              <Typography variant="body2" noWrap>
                {formatDate(activity.date)}
              </Typography>
            </Box>
            <Place sx={{ml: 3, mr: 1}} />
            <Typography variant="body2">{activity.venue}</Typography>
          </Box>
        </CardContent>
        <Divider />
        <Box display='flex' gap={2} sx={{backgroundColor: 'grey.200', py: 3, pl: 3}}>
          {activity.attendees.map(att => (
            <AvatarPopover profile={att} key={att.id} />
          ))}
        </Box>
        <CardContent sx={{display: 'flex', justifyContent: 'space-between', pb: 2}}>
            <Typography variant="body2">
              {activity.description}
            </Typography>
            <Button 
              component={Link} 
              to={`/activities/${activity.id}`} 
              size="medium" 
              variant="contained"
              sx={{display: 'flex', justifySelf: 'self-end', borderRadius: 3}}
            >
              View
            </Button>
        </CardContent>
    </Card>  
  )
}