import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Divider, Typography } from "@mui/material";
import ProfileCard from "./ProfileCard";

type Props = {
    activeTab: number
}

/**
 * Component that displays a list of either the followers or the followings of a given profile.
 *
 * The list shown depends on the `activeTab` prop:
 * - `activeTab === 3`: Show people following the profile
 * - Otherwise: Show people the profile is following
 *
 * Uses `useProfile` to fetch both profile info and the relevant followings list.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.activeTab - Index of the active tab determining which list to display.
 *
 * @example
 * <ProfileFollowings activeTab={3} /> // Displays followers
 * <ProfileFollowings activeTab={4} /> // Displays followings
 */
export default function ProfileFollowings({activeTab}: Props) {
    const {id} = useParams();
    const predicate = activeTab === 3 ? 'followers' : 'followings';
    const {profile, followings, loadingFollowings} = useProfile(id, predicate);

    return (
        <Box>
            <Box display='flex'>
                <Typography variant="h5">
                    {activeTab === 3 
                    ? `People following ${profile?.displayName}` 
                    : `People ${profile?.displayName} is following`}
                </Typography>
            </Box>
            <Divider sx={{my: 2}}/>
            {loadingFollowings ? <Typography>Loading...</Typography> : (
                <Box display='flex' marginTop={3} gap={3}>
                    {followings?.map(profile => (
                        <ProfileCard key={profile.id} profile={profile} />
                    ))}
                </Box>
            )}
        </Box>
    )
}
