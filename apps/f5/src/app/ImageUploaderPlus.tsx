import React, { useState, useCallback } from 'react';
import ImageUploader from 'react-images-upload';
import Grid from '@material-ui/core/Grid';
import { useImageUpload } from './firebase';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'; 
import Button from '@material-ui/core/Button';
import { getImageUrl } from './utils';
import FileCopyIcon from '@material-ui/icons/FileCopy';
  
type onChange = (files: File[], pictures: string[]) => void
const initialPending: File[] = [];
const initialCompleted: string[] = [];

const imageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  verticalAlign: 'baseline',
  marginTop: '5px',
}

const buttonStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  verticalAlign: 'baseline',
  marginTop: '5px',
}
 
export const ImgUploaderPlus = () => { 
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
      <Grid container direction="row-reverse" style={{ marginBottom: '5px' }}>
        <Grid item>
          <Button
            onClick={upload}
            disabled={pending.length === 0}
          >
            <Grid container spacing={1}>
              <Grid item>
                Upload
              </Grid>
              <Grid item>
                <ArrowUpwardIcon />
              </Grid>
            </Grid>
          </Button>
        </Grid>
      </Grid>
      <Grid 
        container
        alignItems='center'
        style={imageStyle}
      >
        {completed.map(url => {
          return (
            <>
              <Grid
                item xs={12}
                style={{ marginBottom: '5px' }}
              >
                <a href={url}>
                  <img
                    src={url}
                    style={{ height: '10em' }}
                  />
                </a>
              </Grid>
              <Grid
                item
                xs={12}
                container
                direction="row-reverse"
              >
                <Button
                  onClick={() => navigator.clipboard.writeText(url)}
                >
                  <div style={{ float: 'left', ...buttonStyle }} >
                    <span style={{
                      display: 'inline',
                      marginRight: '10px',
                      marginLeft: '10px',
                    }}>
                      Click to Copy
                    </span>
                    <span style={{display: 'inline', marginRight: '10px'}}>
                      <FileCopyIcon />
                    </span>
                  </div>
                </Button>
              </Grid>
            </>
          );
        })}
      </Grid>
    </>
  );
}