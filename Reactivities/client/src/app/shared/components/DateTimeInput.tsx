import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";
import {DateTimePicker, type DateTimePickerProps} from '@mui/x-date-pickers';

type Props<T extends FieldValues> = {} & UseControllerProps<T> 
& DateTimePickerProps

/**
 * `DateTimeInput` is a reusable form component for selecting a date and time.
 * It integrates with `react-hook-form` using `useController`.
 *
 * @typeParam T - The form's field values type (from react-hook-form).
 * @param props - Standard props for a DateTimePicker combined with UseControllerProps.
 *
 * The component:
 * - Uses `useController` to register itself with the form.
 * - Converts between Date values and the picker.
 * - Shows validation errors directly under the field.
 */
export default function DateTimeInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props});

  return (
    <DateTimePicker
        {...props}
        value={field.value ? new Date(field.value) : null}
        onChange={value => {
            field.onChange(new Date(value!))
        }}
        sx={{width: '100%'}}
        slotProps={{
            textField: {
                onBlur: field.onBlur,
                error: !!fieldState.error,
                helperText: fieldState.error?.message
            }
        }}
    />
  )
}

