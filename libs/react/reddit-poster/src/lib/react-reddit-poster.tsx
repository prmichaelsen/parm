import Button from '@material-ui/core/Button';
import React from 'react';
import { useField } from '@parm/react/use-field';
import { reddit } from '@parm/reddit';

import './react-reddit-poster.scss';

/* eslint-disable-next-line */
export interface ReactRedditPosterProps {
  accessToken: string;
  refreshToken: string;
}

export const ReactRedditPoster = (props: ReactRedditPosterProps) => {
  const {
    value: imageUrl,
    field: imageUrlField,
  } = useField({
    value: '',
    label: 'Image url to post',
  });
  const {
    value: initialSubreddit,
    field: initialSubredditField,
  } = useField({
    value: '',
    label: 'The subreddit to submit directly to',
  });
  const {
    value: postTitle,
    field: postTitleField,
  } = useField({
    value: '',
    label: 'Post title',
  });
  const {
    value: subreddits,
    field: subredditsField,
  } = useField({
    value: '',
    label: 'Target cross-posting subreddits',
    placeholder: 'Enter each subreddit on a newline',
    multiline: true,
  });
  const submit = async () => {
    const snoo = reddit(props);
    const submission = await (snoo as any).submitLink({
      url: imageUrl,
      subredditName: initialSubreddit,
      title: postTitle,
    } as any);
    if (!submission) {
      console.error('could not submit submit');
      return;
    }
    subreddits.split('\n').forEach(async subreddit => {
      const crosspostResult = await (submission as any).submitCrosspost({
        subredditName: subreddit,
        title: postTitle,
      }); 
      if (!crosspostResult) {
        console.error('could not crosspost to ', subreddit);
      }
    });
  };
  return (
    <div>
      {postTitleField}
      {imageUrlField}
      {initialSubredditField}
      {subredditsField}
      <Button
        onClick={submit}
      >
        Submit 
      </Button>
    </div>
  );
};

export default ReactRedditPoster;
