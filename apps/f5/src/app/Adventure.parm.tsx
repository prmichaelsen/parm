import React, { useEffect, useState } from 'react';
import { environment } from '../environments/environment';
import Typography from '@material-ui/core/Typography';
import { LoadingSpinner } from './LoadingSpinner';
import { useStyles } from './useStyles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useData } from './firebase';
import { EndMessage } from './EndMessage';
import { AdventureOptionCard } from './AdventureOptionCard';
import { Option } from './firebase';
import { useQueryParams, StringParam } from 'use-query-params'; 
import Markdown from 'markdown-to-jsx';
import SideBar from './SideBar';
import { useFilter } from '@parm/react/filter-control';
import CardContent from '@material-ui/core/CardContent';

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
  const focus = query.focus || rootId;
  const nodes: Option[] = data.nodes
    .filter(v => filter(v.text));
  const focusNode = nodes.find(n => n.id === focus);

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
        <div className={classes.cards}>
          <CardContent>
            {control}
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