import { got } from 'got';

import { GLEAN_TOKEN } from '../constants.js';

const GLEAN_URL = 'https://iterable-be.glean.com/api/index/v1';

const gleanUrl = (endpoint: string) => `${GLEAN_URL}/${endpoint}`;

export const get = <TResponse = any, TData = any>(endpoint: string, data?: TData) =>
  got(gleanUrl(endpoint), {
    headers: {
      Authorization: `Basic ${GLEAN_TOKEN}`,
    },
    json: data,
  }).json<TResponse>();

export const post = <TResponse = any, TData = any>(endpoint: string, data?: TData) =>
  got
    .post(gleanUrl(endpoint), {
      headers: {
        Authorization: `Basic ${GLEAN_TOKEN}`,
      },
      json: data,
    })
    .json<TResponse>();
