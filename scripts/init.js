import { createUser } from '../services/userService.js';
import { API_KEY, API_SECRET } from '../data/credentials.js';

const init = () => {
  createUser(API_KEY, API_SECRET);
};

export default init;