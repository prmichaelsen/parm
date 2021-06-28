import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GitHubIcon from '@material-ui/icons/GitHub';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FeedbackIcon from '@material-ui/icons/Feedback'; 
import BrushIcon from '@material-ui/icons/Brush'; 
import OpenInNewIcon from '@material-ui/icons/OpenInNew'; 
import AppBar from '@material-ui/core/AppBar';
import { Fab, useTheme, Divider, Grid, Switch } from '@material-ui/core';
import { storage } from './storage';
import { useStyles } from './useStyles';
import { useThemePrefs } from './hooks';
import { useData } from './firebase';
import { Markdown } from './Markdown';


export default function SideBar() {
  const { theme, isDark, toggleDark } = useThemePrefs();
  const userId = storage.userId();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { state } = useData();

  // you can create a custom nav item
  // by creating a node with ListItems
  // in it. It is stored in the database
  // and retrieved on page load.
  const customNavItemsId = 'navigation';
  const customNavItems = state.nodes.find(n => n.id === customNavItemsId);
  const MyList = () => (
    <span role="presentation">
      <List className={classes.list}>
        <ListItem
          button
          component="a"
          aria-label="Contribute on GitHub"
          href="https://github.com/prmichaelsen/parm/tree/master/apps/f5"
          target="_blank"
          rel="noopener"
        >
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText primary="Contribute">
          </ListItemText>
        </ListItem>
        <ListItem 
          button
          component="a"
          href="https://forms.gle/KJxi1b7AE3ey48vD8"
          target="_blank"
          aria-label="Contact & Feedback"
          rel="noopener"
        >
          <ListItemIcon>
            <FeedbackIcon/>
          </ListItemIcon>
          <ListItemText primary="Feedback"/>
        </ListItem>
        <Divider/>
        <ListItem>
          <ListItemIcon>
            <BrushIcon/>
          </ListItemIcon>
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Light</Grid>
            <Grid item>
              <Switch checked={isDark} onChange={toggleDark}/>
            </Grid>
            <Grid item>Dark</Grid>
          </Grid>
        </ListItem>
        {customNavItems && (
          <>
            <Divider/>
            <Markdown>
              {customNavItems.text || ''}
            </Markdown>
          </>
        )}
      </List>
      <Fab onClick={() => setExpanded(false)} className={classes.menuButton}>
        {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Fab>
    </span>
  );

  return (
    <>
      <Fab
        className={classes.menuButton}
        aria-label="open menu"
        onClick={() => setExpanded(true)}
      >
        <MenuIcon />
      </Fab>
      <Drawer anchor="right" open={expanded} onClose={() => setExpanded(false)}>
        <MyList/> 
      </Drawer> 
    </>
  );

}