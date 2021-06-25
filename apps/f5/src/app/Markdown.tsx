
import MarkdownToJsx from 'markdown-to-jsx'; 
import React from 'react';
import { Typography } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import AceEditor from 'react-ace';
 
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-twilight';
import { useThemePrefs } from './hooks';
import { useStyles } from './useStyles';
import { YoutubeLinkConverter } from './YoutubeLinkConverter';
import { ImgUploader } from './ImageUploader';
import { ImgViewer } from './ImageViewer';
import { YoutubeEmbed } from './YoutubeEmbed';
import { OAuth20 } from './OAuth2.0';
import { Admin } from './Admin';

import { DateSubtracter } from '@parm/react/date-subtracter';
import { RedditCrossposter } from '@parm/react/reddit-crossposter';
import { ReactRedditPoster } from '@parm/react/reddit-poster';
import UserId from './UserId';
import { Img } from './Img';
import { RedditTokenManager } from './storage';

export const Markdown = ({ children }) => {
  const { isDark } = useThemePrefs();
  const aceTheme = isDark ? 'twilight' : 'xcode';
  const classes = useStyles();
  return (
    <MarkdownToJsx options={{
      forceBlock: false,
      overrides: {
        blockquote: ({ children, ...props }) => (
          <Typography
            {...props}
            variant="body2"
            color="textSecondary"
            className={classes.quote}
            component="div"
          >
            {children}
          </Typography>
        ),
        code: ({ children, className: lang, ...props }) => {
          if (!lang) {
            return (
              <code key={props.key}>{children}</code>
            )
          }
          return (
            <AceEditor
              maxLines={Infinity}
              mode={lang ? lang.split('-')[1] : ''}
              theme={aceTheme}
              value={children}
              readOnly
            />
          );
        },
        img: Img,
        YoutubeLinkConverter,
        ImgUploader,
        Admin,
        ImgViewer,
        ListItem,
        DateSubtracter,
        RedditCrossposter: p => {
          const {
            accessToken, refreshToken
          } = RedditTokenManager.get();
          if (accessToken || !refreshToken) {
            return (
              <div>
                To use the RedditCrossposter, you must 
                first authorize parm to work with Reddit.
                <br/>
                <a href="/?focus=H0ua4f7Ue8Mv2zjxtO4S">
                  Click here to get started
                </a>
              </div>
            );
          }
          return <RedditCrossposter {...{ ...p, accessToken, refreshToken }} />
        },
        ReactRedditPoster: p => {
          const {
            accessToken, refreshToken
          } = RedditTokenManager.get();
          if (accessToken || !refreshToken) {
            return (
              <div>
                To use the ReactRedditPoster, you must 
                first authorize parm to work with Reddit.
                <br/>
                <a href="/?focus=H0ua4f7Ue8Mv2zjxtO4S">
                  Click here to get started
                </a>
              </div>
            );
          }
          return <ReactRedditPoster {...{ ...p, accessToken, refreshToken }} />
        },
        UserId,
        YoutubeEmbed,
        OAuth20,
      },
    }}>
      {children}
    </MarkdownToJsx>
  );
}