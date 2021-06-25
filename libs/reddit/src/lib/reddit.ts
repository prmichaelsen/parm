import snoowrap from 'snoowrap';
import { reddit as redditSecrets } from '@parm/util';

export function reddit({ accessToken, refreshToken}) {
  const { 
    clientId, clientSecret, 
    userAgent, 
  } = redditSecrets;
  return new snoowrap({
    clientId, clientSecret, userAgent,
    accessToken, refreshToken 
  });
}