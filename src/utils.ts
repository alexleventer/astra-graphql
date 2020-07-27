import fetch from 'cross-fetch';
const {
  ASTRA_DB_ID,
  ASTRA_DB_REGION,
  ASTRA_DB_USERNAME,
  ASTRA_DB_PASSWORD
} = process.env;

export const getAstraToken = async () => {
  if (!ASTRA_DB_ID) {
    throw new Error('Cannot get Astra token without ASTRA_DB_ID environment variable set');
  }
  if (!ASTRA_DB_REGION) {
    throw new Error('Cannot get Astra token without ASTRA_DB_REGION environment variable set');
  }
  if (!ASTRA_DB_USERNAME) {
    throw new Error('Cannot get Astra token without ASTRA_DB_USERNAME environment variable set');
  }
  if (!ASTRA_DB_PASSWORD) {
    throw new Error('Cannot get Astra token without ASTRA_DB_PASSWORD environment variable set');
  }
  return await fetch(`https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v1/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: ASTRA_DB_USERNAME,
      password: ASTRA_DB_PASSWORD
    })
  }).then(res => {
    if (res.status >= 400) {
      throw new Error('Could not generate Astra credentials');
    }
    return res.json();
  }).then(body => {
    if (!body || !body.authToken) {
      throw new Error('Could not generate Astra credentials');
    }
    return body.authToken;
  });
}
