import { createMuiTheme } from '@material-ui/core/styles'; 
import { useState, useMemo } from 'react';
import { singletonHook } from 'react-singleton-hook';
import { storage } from './storage';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});

interface ThemeState {
  isDark: boolean,
  isTop: boolean,
}

const initialThemeState: ThemeState = {
  isDark: storage.isDark(),
  isTop: false,
}

let setThemeState: React.Dispatch<React.SetStateAction<ThemeState>> = () => { throw new Error(`You must call useThemePrefs first.`); };

const useThemeState = singletonHook(initialThemeState, () => {
  const [state, setState] = useState(initialThemeState);
  setThemeState = (state: ThemeState) => {
    storage.setIsDark(state.isDark);
    setState(state);
  };
  return state;
});

export const useThemePrefs = () => {
  const state = useThemeState();
  const { isDark, isTop } = state;
  const theme = useMemo(() =>
    createMuiTheme({
      palette: {
        type: isDark ? 'dark' : 'light',
      },
      typography: {
        button: {
          textTransform: 'none'
        }
      }
    }), [
      isDark,
      isTop,
    ] 
  );

  const toggleDark = () => setThemeState({
    ...state,
    isDark: !isDark,
  });
  const toggleTop = () => ({
    ...state,
    isTop: !isTop,
  });

  return {
    theme,
    isDark,
    isTop,
    toggleDark,
    toggleTop,
  };
}

interface SortState {
  sortAscending: boolean;
}

const initialSortState: SortState = {
  sortAscending: storage.sort(),
}

export const useSortState = () => {
  const [state, setState] = useState(initialSortState);
  const toggleSort = () => {
    storage.toggleSort();
    setState({
      sortAscending: storage.sort(),
    });
  };
  return {
    ...state,
    toggleSort,
  };
};
