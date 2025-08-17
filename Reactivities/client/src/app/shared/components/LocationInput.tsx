import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";
import { Box, debounce, List, ListItemButton, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

/**
 * Props for the LocationInput component.
 * @template T The field values type from react-hook-form.
 */
type Props<T extends FieldValues> = {
    label: string
} & UseControllerProps<T>

/**
 * An input component that integrates with `react-hook-form` to select a location.
 * 
 * Features:
 * - Calls LocationIQ API to fetch autocomplete suggestions.
 * - Displays a dropdown of suggestions.
 * - On select, saves a location object ({ venue, city, latitude, longitude }) into the form state.
 * - Debounces API calls to reduce requests.
 */
export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props});
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
    const [inputValue, setInputValue] = useState(field.value || '');

    useEffect(() => {
        if (field.value && typeof field.value === 'object') {
            setInputValue(field.value.venue || '');
        } else {
            setInputValue(field.value || '');
        }
    }, [field.value])

    const locationKey = import.meta.env.VITE_LOCATIONIQ_KEY;
    const locationUrl = `https://api.locationiq.com/v1/autocomplete?key=${locationKey}&limit=5&dedupe=1&`;

    /**
     * Fetches autocomplete suggestions from the LocationIQ API.
     * Debounced to limit API calls.
     * @param query The search query string
     */
    const fetchSuggestions = useMemo(
        () => debounce(async (query: string) => {
            if (!query || query.length < 3) {
                setSuggestions([]);
                return;
            }

            setLoading(true);

            try {
                const res = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${query}`);
                setSuggestions(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }, 500), [locationUrl]
    )

    /**
     * Handles input changes and triggers suggestion fetching.
     * @param value The current input value
     */
    const handleChange = async (value: string) => {
        field.onChange(value);
        await fetchSuggestions(value);
    }

    /**
     * Handles the selection of a suggestion.
     * Updates the form state with full location data.
     * @param location A LocationIQ suggestion object
     */
    const handleSelect = (location: LocationIQSuggestion) => {
        const city = location.address?.city || location.address?.town || location.address?.village;
        const venue = location.display_name;
        const latitude = location.lat;
        const longitude = location.lon;

        setInputValue(venue);
        field.onChange({venue, city, latitude, longitude});
        setSuggestions([]);
    }
    

    return (
        <Box>
            <TextField
                {...props}
                value={inputValue}
                onChange={e => handleChange(e.target.value)}
                fullWidth
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
            />
            {loading && <Typography>Loading...</Typography>}
            {suggestions.length > 0 && (
                <List sx={{border: 1}}>
                    {suggestions.map(suggestion => (
                        <ListItemButton
                            divider
                            key={suggestion.place_id}
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion.display_name}
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    )
}