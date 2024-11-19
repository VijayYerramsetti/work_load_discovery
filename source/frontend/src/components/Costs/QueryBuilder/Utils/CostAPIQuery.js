import {
  handleResponse,
  readResultsFromS3,
  wrapCostAPIRequest,
} from '../../../../API/Handlers/CostsGraphQLHandler';

export const sendCostQuery = (queryToExecute) =>
  wrapCostAPIRequest(queryToExecute.queryFunction, queryToExecute.queryOptions)
    .then(handleResponse);
export const fetchNextPage = (pagination, queryDetails) =>
  wrapCostAPIRequest(readResultsFromS3, {
    s3Query: {
      bucket: queryDetails.s3Bucket,
      key: queryDetails.s3Key,
      pagination: pagination,
    },
  })
    .then(handleResponse);
