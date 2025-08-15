import { Box, Paper, Tab, Tabs } from '@mui/material';
import { useState, type SyntheticEvent } from 'react'
import ProfilePhotos from './ProfilePhotos';
import ProfileAbout from './ProfileAbout';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from './ProfileActivities';

/**
 * ProfileContent component displays a vertical tab layout for profile sections.
 *
 * Features:
 * - Renders tab navigation for About, Photos, Events, Followers, and Following.
 * - Each tab switches to a separate section component.
 *
 * Uses internal state to manage active tab.
 *
 * @example
 * <ProfileContent />
 */
export default function ProfileContent() {
    const [value, setValue] = useState(0);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    const tabContent = [
        {label: 'About', content: <ProfileAbout />},
        {label: 'Photos', content: <ProfilePhotos />},
        {label: 'Events', content: <ProfileActivities />},
        {label: 'Followers', content: <ProfileFollowings activeTab={value} />},
        {label: 'Following', content: <ProfileFollowings activeTab={value} />}
    ]

    return (
        <Box
            component={Paper}
            mt={2}
            p={3}
            elevation={3}
            height={500}
            sx={{display: 'flex', alignItems: 'flex-start', borderRadius: 3}}
        >
            <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                sx={{borderRight: 1, height: 450, minWidth: 200}}
            >
                {tabContent.map((tab, index) => (
                    <Tab key={index} label={tab.label} sx={{mr: 3}} />
                ))}
            </Tabs>
            <Box sx={{flexGrow: 1, p: 3, pt: 0}}>
                {tabContent[value].content}
            </Box>
        </Box>
    )
}
