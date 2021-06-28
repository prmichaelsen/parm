import React, { useEffect, useState } from 'react';
import { environment } from '../environments/environment';
import Typography from '@material-ui/core/Typography';
import { LoadingSpinner } from './LoadingSpinner';
import { useStyles } from './useStyles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useData } from './firebase';
import { EndMessage } from './EndMessage';
import { Option } from './firebase';
import { useQueryParams, StringParam } from 'use-query-params'; 
import SideBar from './SideBar';
import { useFilter } from '@parm/react/filter-control';
import CardContent from '@material-ui/core/CardContent';
import { storage } from './storage';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { useSortState } from './hooks';
import Markdown from 'markdown-to-jsx';
import { AdventureOptionCard } from './AdventureOptionCard';


const compareByTime = (a: Option, b: Option) => {
  const result = +a.createTime.toDate() - +b.createTime.toDate();
  return storage.sort() ? result : -result;
}

export default function Adventure(props) {
  const classes = useStyles();
  const [afterSize, setAfterSize] = useState(4);
  const [beforeSize, setBeforeSize] = useState(1);
  const [query, setQuery] = useQueryParams({
    focus: StringParam,
  });
  const { 
    state: data, setCurrent: setCurrentState,
    createOption, updateNode,
  } = useData();
  const fetchAfter = () => 
    setAfterSize(afterSize + 3); 
  const fetchBefore = () => 
    setBeforeSize(beforeSize + 3); 

  const { filter, control } = useFilter();

  const rootId = data.root && data.root.id;
  const focus = query.focus || 'create';
  const nodes: Option[] = data.nodes
    .filter(v => filter(v.text))
    .sort(compareByTime)
    ;
  const focusNode = nodes.find(n => n.id === focus);

  const { toggleSort, sortAscending } = useSortState();

  const CreateCard = () => (
    <AdventureOptionCard 
      showBackButton={false}
      key={'add'}
      new
      parent={rootId}
      createOption={createOption}
      type={'action'}
    />
  );

  return (
    <div className={classes.paper}>
      <SideBar/>
      <Typography component="h1" variant="h5">
        <Markdown>
          {environment.header}
        </Markdown>
      </Typography>
      <Typography>
        {environment.metaDescription && (
            <Markdown>
              {environment.metaDescription}
            </Markdown>
        )}
      </Typography>
        <div className={classes.cards}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={10}>
                {control}
              </Grid>
              <Grid item xs={2}>
                oldest first
                <Switch checked={sortAscending} onChange={toggleSort}/>
              </Grid>
            </Grid>
          </CardContent>
          {focus === 'create' && (
            <CreateCard/>
          )}
          {focusNode && (
            <AdventureOptionCard 
              createOption={updateNode}
              key={'focus'}
              {...focusNode}
              prev
            />
          )}
          <InfiniteScroll
            dataLength={afterSize}
            next={fetchAfter}
            hasMore={afterSize < nodes.length}
            loader={<LoadingSpinner/>}
            endMessage={<EndMessage/>}
          >
            {nodes.slice(0, afterSize).map((node, i) => {
              return (
                <AdventureOptionCard 
                  createOption={updateNode}
                  key={'after-' + i}
                  {...node}
                  prev
                />
              )
            })}
            <CreateCard/>
          </InfiniteScroll>
        </div>
    </div>
  );
}