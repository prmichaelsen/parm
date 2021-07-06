import React, { useState, useCallback } from 'react';
// import ImageUploader from 'react-images-upload';
import Grid from '@material-ui/core/Grid';
import { useImageUpload } from './firebase';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'; 
import Button from '@material-ui/core/Button';
import { getImageUrl } from './utils';
import { environment } from '../environments/environment';
const ImageUploader = () => <div></div>;
  
type onChange = (files: File[], pictures: string[]) => void
const initialPending: File[] = [];
const initialCompleted: string[] = [];
 
export const ImgUploader = () => { 
  const [pending, setPending] = useState([...initialPending]);
  const [completed, setCompleted] = useState([...initialCompleted]);
  const { uploadImage } = useImageUpload();
  const onDrop: onChange = (pictures) => {
    setPending([
      ...pictures
    ]);
  }

  const upload = useCallback(async () => {
    await Promise.all(pending.map(async f => {
      try {
        const result = await uploadImage(f);
        const url = getImageUrl({filename: `${result.ref.name}`});
        setCompleted(prev => [
          url,
          ...prev,
        ]);
        console.log(url);
      } catch (e) {
        console.log(e)
      }
    }));
  }, [pending]);

  return (
    <>
    <ImageUploader
      withIcon={true}
      withPreview={true}
      buttonText='Choose images'
      onChange={onDrop}
      imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
      maxFileSize={5242880}
    />
      <Grid container direction="row-reverse">
        <Grid item>
          <Button
            onClick={upload}
            disabled={pending.length === 0}
          >
            Upload
            <ArrowUpwardIcon />
          </Button>
        </Grid>
      </Grid>
    <Grid container>
      {completed.map(url => {
        return (
          <Grid item xs={4} >
            <a href={url}>
              <img
                src={url}
                style={{ width: '100%' }}
              /> 
            </a>
          </Grid>
        );
      })}
    </Grid>
    </>
  );
}