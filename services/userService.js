import crypto from 'crypto';

const users = [];

const createUser = (apiKey, apiSecret) => {
  const user = { apiKey: apiKey, apiSecret: apiSecret };
  users.push(user);
  return user;
};

const createSignature = (date, apiSecret) => {
  const hmac = crypto.createHmac('sha1', apiSecret);
  hmac.update(`date: ${date}`);
  return hmac.digest('base64');
};

const createAuthHeader = (date, apiKey, apiSecret) => {
  return `hmac username="${apiKey}", algorithm="hmac-sha1", headers="date", signature="${createSignature(date, apiSecret)}"`;
};

const authorize = ({ date, apikey, authorization }) => {
  const user = users.find(item => item.apiKey === apikey);
  if (!user) {
    return false;
  }
  const expected = createAuthHeader(date, user.apiKey, user.apiSecret);
  return authorization === expected;
};

export { createUser, authorize };

