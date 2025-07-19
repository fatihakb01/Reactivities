import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

/**
 * Props for the SelectInput component.
 * @template T The field values type from react-hook-form.
 */
type Props<T extends FieldValues> = {
    items: {text: string, value: string}[];
    label: string;
} & UseControllerProps<T> 

/**
 * A select input component integrated with `react-hook-form`.
 * 
 * Features:
 * - Renders a Material-UI Select with given items.
 * - Shows validation errors from `react-hook-form`.
 */
export default function SelectInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props});

    return (
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={field.value || ''}
                label={props.label}
                onChange={field.onChange}
            >
                {props.items.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}