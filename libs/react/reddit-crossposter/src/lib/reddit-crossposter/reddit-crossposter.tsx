import Button from '@material-ui/core/Button';
import React from 'react';

import './reddit-crossposter.scss';
import { useField } from '@parm/react/use-field';
import { reddit } from '@parm/reddit';

/* eslint-disable-next-line */
export interface RedditCrossposterProps {
  accessToken: string;
  refreshToken: string;
}

const validate = (value: string) => value.trim() !== '';

const getMatch = (value: string) => {
  const id = /comments\/(\w+)/;
  const matches = value.match(id);
  if (!matches)
    return '';
  const match = matches[0];
  const sections = match.split('/');
  return sections[1];
}

export const RedditCrossposter = (props: RedditCrossposterProps) => {
  const {
    value: submissionUrl,
    field: submissionUrlField,
  } = useField({
    value: '',
    label: 'Submission url to crosspost',
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
    label: 'Subreddits',
    placeholder: 'Enter each subreddit on a newline',
    multiline: true,
  });
  const submit = async () => {
    const snoo = reddit(props);
    const postId = getMatch(submissionUrl);
    const submission = await (snoo.getSubmission(postId) as any);
    if (!submission) {
      console.error('could not get submission for ', postId);
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
      {submissionUrlField}
      {postTitleField}
      {subredditsField}
      <Button
        onClick={submit}
      >
        Submit 
      </Button>
    </div>
  );
};

export default RedditCrossposter;
