import React from 'react';
import { ReactRedditPoster as ReactRedditPoster_ } from '@parm/react/reddit-poster';
import { RedditTokenManager } from './storage';

export const ReactRedditPoster = (props) => {
  const {
    accessToken, refreshToken
  } = RedditTokenManager.get();
  if (!accessToken || !refreshToken) {
    return (
      <div>
        To use the ReactRedditPoster, you must
        first authorize parm to work with Reddit.
        <br />
        <a href="/?focus=H0ua4f7Ue8Mv2zjxtO4S">
          Click here to get started
        </a>
      </div>
    );
  }
  return (
    <ReactRedditPoster_
      {...{ ...props, accessToken, refreshToken }}
    />
  );
}