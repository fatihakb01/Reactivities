import { Grid, Typography } from '@mui/material'
import ProfileHeader from './ProfileHeader'
import ProfileContent from './ProfileContent'
import { useParams } from 'react-router';
import { useProfile } from '../../lib/hooks/useProfile';

/**
 * Top-level component for displaying a user's profile page.
 *
 * Features:
 * - Fetches profile data using `useProfile` based on the route ID.
 * - Displays loading and error states.
 * - Renders `ProfileHeader` and `ProfileContent` for the layout.
 *
 * @example
 * <Route path="/profiles/:id" element={<ProfilePage />} />
 */
export default function ProfilePage() {
    const {id} = useParams();
    const {profile, loadingProfile} = useProfile(id);

    if (loadingProfile) return <Typography>Loading profile...</Typography>

    if (!profile) return <Typography>Profile not found</Typography>

    return (
        <Grid container>
            <Grid size={12}>
                <ProfileHeader profile={profile}/>
                <ProfileContent />
            </Grid>
        </Grid>
    )
}
