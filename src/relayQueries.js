/* @flow */
/* eslint-disable no-param-reassign, prefer-template */

import type {
  RelayClassicRequest,
  FetchWithMiddleware,
  RRNLRequestObjectQuery,
} from './definition';

export default function queries(
  relayRequestList: RelayClassicRequest[],
  fetchWithMiddleware: FetchWithMiddleware
): Promise<any> {
  return Promise.all(
    relayRequestList.map(relayRequest => {
      const req: RRNLRequestObjectQuery = {
        relayReqId: relayRequest.getID(),
        relayReqObj: relayRequest,
        relayReqType: 'query',
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      
          query: relayRequest.getQueryString(),
          variables: relayRequest.getVariables(),
        }),
      };

      return fetchWithMiddleware(req)
        .then(({ data }) => relayRequest.resolve({ response: data }))
        .catch(err => relayRequest.reject(err));
    })
  );
}
