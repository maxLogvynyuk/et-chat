import fetch from 'node-fetch';
import _split from 'lodash/split';
import isEmpty from 'lodash/isEmpty'

const currentToken = {
  current: null
};

export default async function CheckToken(request, response, next) {
  const headerAuth = request.headers.authorization;
  console.info('Token and current', headerAuth, currentToken );

  if (process.env.USE_TOKEN_CHEKING !== 'off' && !request.headers.uploadfile) {
    if (request.query.user !== '200' || !request.query.user) {
      if (headerAuth && isEmpty(currentToken) || headerAuth !== currentToken.current) {
        const token = _split(headerAuth, ' ')[1];
        const payload = await fetch(process.env.TOKEN_CHEKING_URL ,{
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
        if (payload.status === 401) {
          console.info('NOT VERIFIED');
          return response.status(401).json({message: 'NOT VERIFIED'})
        }
        currentToken.current = token;
      }
    }
  }
  next();
}
