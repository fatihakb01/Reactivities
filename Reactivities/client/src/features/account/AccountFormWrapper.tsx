import { Box, Button, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { FormProvider, useForm, type FieldValues, type Resolver } from "react-hook-form";

type Props<TFormData extends FieldValues> = {
    title: string
    icon: ReactNode
    onSubmit: (data: TFormData) => Promise<void>
    children: ReactNode
    submitButtonText: string
    resolver?: Resolver<TFormData>
    reset?: boolean
}

/**
 * A generic, reusable form wrapper component.
 *
 * This component provides a consistent layout and handles common form functionality
 * like submission and validation, allowing for a clean separation of concerns.
 *
 * Features:
 * - Uses `react-hook-form`'s `FormProvider` for state management.
 * - Handles form submission with a generic async `onSubmit` prop.
 * - Optionally resets the form after a successful submission.
 * - Disables the submit button while the form is invalid or submitting.
 * - Material UI for styling and layout.
 *
 * Props:
 * @propert {Object} AccountFormWrapperProps
 * @property {string} title - The title of the form.
 * @property {ReactNode} icon - The icon to display next to the title.
 * @property {(data: TFormData) => Promise<void>} onSubmit - The async function to call on form submission.
 * @property {ReactNode} children - The form fields to be rendered inside the wrapper.
 * @property {string} submitButtonText - The text for the submit button.
 * @property {Resolver<TFormData>} [resolver] - The validation resolver (e.g., from Zod).
 * @property {boolean} [reset] - Whether to reset the form after a successful submission.
 *
 * Example usage:
 * ```tsx
 * <AccountFormWrapper<MyFormSchema>
 * title="My Form"
 * icon={<MyIcon />}
 * onSubmit={data => console.log(data)}
 * submitButtonText="Submit"
 * resolver={myResolver}
 * >
 * <TextInput name="myField" label="My Field" />
 * </AccountFormWrapper>
 * ```
 */
export default function AccountFormWrapper<TFormData extends FieldValues>({
    title,
    icon,
    onSubmit,
    children,
    submitButtonText,
    resolver,
    reset
}: Props<TFormData>) {
    const methods = useForm<TFormData>({resolver, mode: 'onTouched'})

    const formSubmit = async (data: TFormData) => {
        await onSubmit(data);
        if (reset) methods.reset();
    }

    return (
        <FormProvider {...methods}>
            <Paper 
                component='form' 
                onSubmit={methods.handleSubmit(formSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    gap: 3,
                    maxWidth: 'md',
                    mx: 'auto',
                    borderRadius: 3
                }}
            >

                <Box 
                    display='flex' 
                    alignItems='center' 
                    justifyContent='center'
                    gap={3} 
                    color='secondary.main'
                >
                    {icon}
                    <Typography variant="h4">{title}</Typography>
                </Box>
                {children}
                <Button 
                    type='submit'
                    disabled={!methods.formState.isValid || methods.formState.isSubmitting}
                    variant="contained"
                    size="large"
                >
                    {submitButtonText}
                </Button>
            </Paper>
        </FormProvider>
    )
}
