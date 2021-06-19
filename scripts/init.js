import { createUser } from '../services/userService.js';
import { API_KEY_1, API_SECRET_1 } from '../data/credentialsUser1.js';
import { API_KEY_2, API_SECRET_2 } from '../data/credentialsUser2.js';

const init = () => {
  createUser(API_KEY_1, API_SECRET_1);
  createUser(API_KEY_2, API_SECRET_2);
};

export default init;