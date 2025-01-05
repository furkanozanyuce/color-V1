import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'color_finder_browser_id';

export const getBrowserId = (): string => {
  let browserId = localStorage.getItem(SESSION_KEY);
  if (!browserId) {
    browserId = uuidv4();
    localStorage.setItem(SESSION_KEY, browserId);
  }
  return browserId;
};