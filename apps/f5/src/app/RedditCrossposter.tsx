import React from 'react';
import { RedditCrossposter as RedditCrossposter_ } from '@parm/react/reddit-crossposter';
import { RedditTokenManager } from './storage';

export const RedditCrossposter = (props) => {
  const {
    accessToken, refreshToken
  } = RedditTokenManager.get();
  if (!accessToken || !refreshToken) {
    return (
      <div>
        To use the RedditCrossposter, you must
        first authorize parm to work with Reddit.
        <br />
        <a href="/?focus=H0ua4f7Ue8Mv2zjxtO4S">
          Click here to get started
        </a>
      </div>
    );
  }
  return (
    <RedditCrossposter_
      {...{ ...props, accessToken, refreshToken }}
    />
  );
}