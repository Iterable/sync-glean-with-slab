import {
  ensureDataSource,
  DataSource as IDataSource,
  CustomDocument,
  DocumentType,
  RenderPreset,
  setBetaUsers,
} from './glean/index.js';

import { BETA_USERS, IS_TEST } from './constants.js';

const slabIcon =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy45OTQ4NiA1LjNIMTUuOTk1VjMuNzY2NzRDMTUuOTk1IDEuNjg2NDMgMTQuMjA0MiAwIDExLjk5NDkgMEg0LjIzMzRDNi4zMjc0NSAwLjEyMDIyNiA3Ljk5NDg2IDUuMyA3Ljk5NDg2IDUuM1oiIGZpbGw9IiM1MEM1REMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjAwMDE0IDcuOTk5OTlIMFYzLjkwOTQ0QzAgMS43NTAzIDEuNzkwODggMCA0LjAwMDA3IDBIMTEuNzYxNkM5LjY2NzU0IDAuMTI0NzgyIDcuOTg2MzMgMS44MjMyOSA3Ljk4NjMzIDMuOTAxM0M3Ljk4NjMzIDMuOTA0MDUgOC4wMDAxNCA3Ljk5OTk5IDguMDAwMTQgNy45OTk5OVoiIGZpbGw9IiNGQ0I0MTUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjAwNTAzIDEwLjc4SDAuMDA0ODUyMjlWMTIuMzEzM0MwLjAwNDg1MjI5IDE0LjM5MzYgMS43OTU3NyAxNi4wOCA0LjAwNDk2IDE2LjA4SDExLjc2NjVDOS42NzI0NyAxNS45NTk4IDguMDA1MDMgMTAuNzggOC4wMDUwMyAxMC43OFoiIGZpbGw9IiM3NDE0NDgiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03Ljk5OTg2IDguMDAwMDZIMTZWMTIuMDkwNkMxNiAxNC4yNDk3IDE0LjIwOTEgMTYgMTEuOTk5OSAxNkg0LjIzODRDNi4zMzI0NiAxNS44NzUzIDguMDEzNjcgMTQuMTc2OCA4LjAxMzY3IDEyLjA5ODdDOC4wMTM2NyAxMi4wOTYgNy45OTk4NiA4LjAwMDA2IDcuOTk5ODYgOC4wMDAwNloiIGZpbGw9IiNGRjQxNDMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjU0OTk5IDYuNTI0MDVINi40MzQ3OVY1Ljg3MjMxSDEuNTQ5OTlWNi41MjQwNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMS41NDk5OSA1LjAzODIxSDYuNDM0NzlWNC4zODY0N0gxLjU0OTk5VjUuMDM4MjFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEuNTQ5OTkgMy41NTIyOUg2LjQzNDc5VjIuOTAwMDJIMS41NDk5OVYzLjU1MjI5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjUzIDEwLjE1MTdIMTQuNDE0OFY5LjVIOS41M1YxMC4xNTE3WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjUzIDExLjYzODFIMTQuNDE0OFYxMC45ODU4SDkuNTNWMTEuNjM4MVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOS41MyAxMy4xMjM5SDE0LjQxNDhWMTIuNDcxN0g5LjUzVjEzLjEyMzlaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwIj4KPHBhdGggZD0iTTAgMEgxNlYxNkgwVjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=';

  export const PostType: CustomDocument = {
    name: 'post',
    displayName: 'Post',
    docCategory: DocumentType.KNOWLEDGE_HUB,
  }
  
  export const DataSource: IDataSource = {
  name: `slab${IS_TEST ? 'test' : ''}`,
  displayName: `Slab${IS_TEST ? ' (Test)' : ''}`,
  datasourceCategory: DocumentType.KNOWLEDGE_HUB,
  isUserReferencedByEmail: false,
  urlRegex: '^https://iterable.slab.*',
  homeUrl: 'https://iterable.slab.com/',
  iconUrl: slabIcon,
  isTestDatasource: IS_TEST,
  renderConfigPreset: RenderPreset.GDRIVE,
};

export const createDataSource = async () => {
  try {
    console.info(`Ensuring Glean datasource ${DataSource.name} exists`);
    await ensureDataSource(DataSource);
    if (IS_TEST) {
      console.info('Adding beta users to Glean data source');
      await setBetaUsers(DataSource.name, BETA_USERS);
    }
  } catch (error: any) {
    console.error('There was a problem syncing the test datasource');
    console.trace(error?.response?.body);
  }
};
