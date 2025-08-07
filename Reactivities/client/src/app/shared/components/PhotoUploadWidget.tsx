import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import {useDropzone} from 'react-dropzone';
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
    uploadPhoto: (file: Blob) => void
    loading: boolean
}

/**
 * A multi-step image upload component with drag-and-drop, cropping, and preview.
 *
 * Features:
 * 1. Drag-and-drop image selection using react-dropzone.
 * 2. Image cropping with a 1:1 aspect ratio using cropperjs.
 * 3. Preview of cropped image before uploading.
 * 4. Calls `uploadPhoto` prop with a cropped Blob.
 *
 * @param {Object} props
 * @param {(file: Blob) => void} props.uploadPhoto - Callback to handle the uploaded cropped image.
 * @param {boolean} props.loading - Indicates if the upload process is ongoing.
 *
 * @example
 * <PhotoUploadWidget uploadPhoto={handleUpload} loading={isUploading} />
 */
export default function PhotoUploadWidget({uploadPhoto, loading}: Props) {
    const [files, setFiles] = useState<object & { preview: string; }[]>([]);
    const cropperRef = useRef<ReactCropperElement>(null);

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview))
        }
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file as Blob)
        })))
    }, []);

    const onCrop = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        cropper?.getCroppedCanvas().toBlob(blob => {
            uploadPhoto(blob as Blob);
        })
    }, [uploadPhoto])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <Grid container spacing={3}>
            <Grid size={4}>
                <Typography variant="overline" color="secondary">Step 1 - Add photo</Typography>
                <Box {...getRootProps()}
                    sx={{
                        border: 'dashed 3px #eee',
                        borderColor: isDragActive ? 'green' : '#eee',
                        borderRadius: '5px',
                        paddingTop: '30px',
                        textAlign: 'center',
                        height: '280px'
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudUpload sx={{fontSize: 80}} />
                    <Typography variant="h5">Drop image here</Typography>
                </Box>
            </Grid>
            <Grid size={4}>
                <Typography variant="overline" color="secondary">Step 2 - Resize image</Typography>
                {files[0]?.preview &&
                    <Cropper 
                        src={files[0]?.preview}
                        style={{height: 300, width: '90%'}}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        preview='.img-preview'
                        guides={false}
                        viewMode={1}
                        background={false}
                        ref={cropperRef}
                    />
                }
                
            </Grid>
            <Grid size={4}>
                {files[0]?.preview && (
                    <>
                        <Typography variant="overline" color="secondary">Step 3 - Preview & upload</Typography>
                        <div 
                            className="img-preview"
                            style={{width: 300, height: 300, overflow: 'hidden'}}
                        />
                        <Button
                            sx={{my: 1, width: 300}}
                            onClick={onCrop}
                            variant="contained"
                            color='secondary'
                            disabled={loading}
                        >
                            Upload
                        </Button>
                    </>
                )}
            </Grid>
        </Grid>
    )
}

