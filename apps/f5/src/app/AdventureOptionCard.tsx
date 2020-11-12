import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Check from '@material-ui/icons/Check'; 
import TextField from '@material-ui/core/TextField';
import { useStyles } from './useStyles';
import { 
  Card, CardContent, Grid, Typography, CardActions, CardHeader,
} from '@material-ui/core';
import { LoadingSpinner } from './LoadingSpinner';
import LazyLoad from 'react-lazyload';
import AddIcon from '@material-ui/icons/Add'; 
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'; 
import LinkIcon from '@material-ui/icons/Link'; 
import EditIcon from '@material-ui/icons/Edit'; 
import FavoriteIcon from '@material-ui/icons/Favorite'; 
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'; 
import ShareIcon from '@material-ui/icons/Share'; 
import MoreVertIcon from '@material-ui/icons/MoreVert'; 
import ImageIcon from '@material-ui/icons/Image';
import { useHistory, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useQueryParams, StringParam } from 'use-query-params';
import { useMeta, useNodeView, useRoles } from './firebase';
import { storage } from './storage';
import { validate } from './validate';
import { Markdown } from './Markdown';

export const AdventureOptionCard = (row: any) => {
  const roles = useRoles();
  const userId = storage.userId();
  const isAuthor = userId === row.creatorId;
  const isAdmin = roles.includes('admin');
  const canEdit = isAuthor || isAdmin;
  const history = useHistory();
  const { views } = useNodeView(row.id);
  const { meta, setMeta } = useMeta(row.id);
  const [{ from, to }] = useQueryParams({
    from: StringParam,
    to: StringParam,
  });
  const classes = useStyles();
  const loading = row == null ? <LoadingSpinner /> : false;
  const canSelect = !row.root && !row.prev;
  const [isEditing, setEditing] = useState(row.new || false);
  const [text, setText] = useState('');
  const handleToggleEdit = () => {
    if (isEditing) {
      if (validate(text) === true) {
        row.createOption({
          text: text.trim(),
          id: row.id,
          parent: row.parent,
          type: row.type,
        });
        setEditing(false);
      }
    } else {
      setText(row.text);
      setEditing(true);
    }
  }
  const handleChange = (event) => {
    setText(event.target.value);
  };
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const liked = meta.likes.includes(userId);
  const setLikes = useCallback(() => {
    if (liked) {
      meta.likes = meta.likes.filter(u => u !== userId);
    } else {
      meta.likes = [...meta.likes, userId];
    }
    setMeta(meta);
  }, [row.id, liked]);

  const visited = meta.visited.includes(userId);
  const setCurrent = useCallback(() => {
    if (!visited) {
      meta.visited = [...meta.visited, userId];
      setMeta(meta);
    }
    row.setCurrent(row.id);
  }, [row.id, visited]);

  const [hasBlurred, setBlurred] = useState(false);
  const onBlur = () => setBlurred(true);
  const url = `/?from=${from}&to=${row.id}&focus=${row.id}#${row.id}`;
  return (
    <Card className={classes.card} id={row.id}>
      <LazyLoad
        className={classes.avatar}
        once
        placeholder={<LoadingSpinner />}
      >
        {row.current && (
          <CardContent>
            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.quote}
              component="div"
            >
              What now?
                  </Typography>
          </CardContent>
        )

          || isEditing && (
            <>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      id="new-option-input"
                      label={row.type === 'prompt' ? 'Divinate' : 'Improvise'}
                      placeholder="Type your dialogue or actions here..."
                      multiline
                      value={text}
                      onChange={handleChange}
                      onBlur={onBlur}
                      error={hasBlurred && validate(text) !== true}
                      helperText={hasBlurred && validate(text)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions disableSpacing>
                <Grid container direction="row-reverse">
                  <Grid item>
                    <IconButton onClick={handleToggleEdit}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardActions>
            </>
          )

          || loading || (
            <>
              <CardActions disableSpacing>
                <Grid container direction="row-reverse">
                  {/* <Grid item>
                          <IconButton aria-label="share" className={classes.action}>
                            <ShareIcon />
                          </IconButton>
                        </Grid> */}
                  <Grid item>
                    <IconButton
                      aria-label={liked ? 'unlike' : 'like'}
                      onClick={setLikes}
                      className={clsx({
                        [classes.active]: liked,
                      })}
                    >
                      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Link to={url}>
                      <IconButton>
                        <LinkIcon />
                      </IconButton>
                    </Link>
                  </Grid>
                  {canEdit && (
                    <Grid item>
                      <IconButton
                        aria-label={'edit'}
                        onClick={handleToggleEdit}
                        className={clsx({
                          [classes.active]: isEditing,
                        })}
                      >
                        <EditIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </CardActions>
              <CardContent>
                <Markdown>
                  {row.text || ''}
                </Markdown>
              </CardContent>
              {!row.current && !isEditing && (
                <CardActions disableSpacing>
                  <Grid container direction='row-reverse'>
                    {canSelect && (
                      <Grid item>
                        <IconButton
                          onClick={setCurrent}
                          aria-label='choose'
                        >
                          <Check />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </CardActions>
              )}
            </>
          )}
      </LazyLoad>
    </Card>
  );
}