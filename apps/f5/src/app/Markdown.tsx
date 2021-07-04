
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
import { ImgUploaderPlus } from './ImageUploaderPlus';
import { ImgViewer } from './ImageViewer';
import { YoutubeEmbed } from './YoutubeEmbed';
import { OAuth20 } from './OAuth2.0';
import { Admin } from './Admin';

import { DateSubtracter } from '@parm/react/date-subtracter';
import { RedditCrossposter } from './RedditCrossposter';
import { ReactRedditPoster } from './ReactRedditPoster';
import UserId from './UserId';
import { Img } from './Img';
import { CardList, CardDeck } from './AdvancedCards';
import { GoogleMe } from './GoogleMe';
import { Alias } from './Alias';

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
        RedditCrossposter,
        ReactRedditPoster,
        UserId,
        YoutubeEmbed,
        OAuth20,
        CardList,
        CardDeck,
        ImgUploaderPlus,
        GoogleMe,
        Alias,
      },
    }}>
      {children}
    </MarkdownToJsx>
  );
}