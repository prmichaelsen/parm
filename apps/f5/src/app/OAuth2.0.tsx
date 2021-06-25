import React, { useState, useCallback } from 'react';
import uuidv1 from 'uuid/v1';
import { reddit } from '@parm/util';
import { StringParam, useQueryParams } from 'use-query-params';
import Axios from 'axios';
import Button from '@material-ui/core/Button';
import { RedditTokenManager } from './storage';

export const OAuth20 = () => { 
  const [uuid] = useState(uuidv1());
  const [token, setToken] = useState(null);
  const [{
    code
  }, setQuery] = useQueryParams({
    code: StringParam,
  });
  const redditAppName = reddit.clientId;
  const baseUrl = 'https://www.reddit.com/api/v1/authorize?';
  const redirectUri = 'https://parm.app/?focus=H0ua4f7Ue8Mv2zjxtO4S';
  const parts = [
    `client_id=${redditAppName}`,
    `response_type=code`,
    `duration=permanent`,
    `state=${uuid}`,
    `redirect_uri=${redirectUri}`,
    `scope=${[
      'edit',
      'submit',
      'read',
      'vote',
    ].join(' ')}`
  ];

  const link = `${baseUrl}${parts.join('&')}`;

  const onCompleteAuthClick = useCallback(async () => {
    const encode = window.btoa(`${reddit.clientId}:${reddit.clientSecret}`);
    const response = await Axios.post<{
      access_token: string;
      refresh_token: string;
    }>(
      'https://www.reddit.com/api/v1/access_token', 
      {
        grant_type: 'authorization_code',
        code,
        redirectUri,
      },
      {
        headers: {
          "Authorization": `Basic ${encode}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const token = { 
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      }
      setToken(token);
      RedditTokenManager().set(token);
  }, [code]);

  return (
    token && (
      <div>
        Congratulations! You have successfully authorized parm with reddit.
      </div>
    ) ||
    code && (
      <div>
        <Button onClick={onCompleteAuthClick}>
          Complete Authorization
        </Button>
      </div>
    ) || (
      <div>
        <Button href={link} target="_blank">
          Authorize Reddit
        </Button>
      </div>
    )
  );
}

