import { environment } from '../environments/environment';
import uuidv1 from 'uuid/v1';

const { app } = environment;
/**
 * track the user.
 * let's me ensure users can't reply to themselves.
 */
const userId = (): string => {
  const key = 'f5-user-id';
  const id = localStorage.getItem(key);
  if (!id) {
    const uuid = uuidv1();
    localStorage.setItem(key,uuid);
    return uuid;
  }
  return id;
}

/**
 * track theme
 */
const isDark = (): boolean => {
  const key = 'f5-is-dark';
  const value = localStorage.getItem(key);
  if (!value) {
    const initial = 'false';
    localStorage.setItem(key, initial);
  }
  return value === 'true';
}

const setIsDark = (value: boolean) => {
  const key = 'f5-is-dark';
  localStorage.setItem(key, String(value));
}

/**
 * whether or not to sort ascending,
 * ie oldest first
 */
const sort = (): boolean => {
  const key = 'f5-sort';
  const value = localStorage.getItem(key);
  if (!value) {
    const initial = 'false';
    localStorage.setItem(key, initial);
  }
  return value === 'true';
}

const toggleSort = () => {
  const key = 'f5-sort';
  localStorage.setItem(key, String(!sort()));
}

/**
 * super simple local storage.
 */
export const storage = {
  /** unique id for this user and this browser */
  userId,
  /** theme */
  isDark, setIsDark,
  /** sort */
  sort, toggleSort,
}

// the below is very nearly generic.
// make it generic next time
// you need to use this pattern.
/**
 * store and retrieve reddit tokens locally.
 */
interface RedditTokens {
  accessToken?: string;
  refreshToken?: string;
}
interface RedditTokenManager {
  key: string;
  get: () => RedditTokens;
  set:  (value: RedditTokens) => void;
}
export const RedditTokenManager: RedditTokenManager = {
  key: `app.${app}.reddit-tokens`,
  get: () => {
    return JSON.parse(localStorage.getItem(RedditTokenManager.key)) || {};
  },
  set: (value: RedditTokens) => {
    localStorage.setItem(RedditTokenManager.key, String(JSON.stringify(value)));
  }
}
