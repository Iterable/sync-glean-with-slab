import { get, post } from './api.js';

export enum ConnectorType {
  API_CRAWL = 'API_CRAWL',
  BROWSER_CRAWL = 'BROWSER_CRAWL',
  BROWSER_HISTORY = 'BROWSER_HISTORY',
  BUILTIN = 'BUILTIN',
  FEDERATED_SEARCH = 'FEDERATED_SEARCH',
  PUSH_API = 'PUSH_API',
  WEB_CRAWL = 'WEB_CRAWL',
  NATIVE_HISTORY = 'NATIVE_HISTORY',
}

export enum DocumentType {
  UNCATEGORIZED = 'UNCATEGORIZED',
  TICKETS = 'TICKETS',
  CRM = 'CRM',
  PUBLISHED_CONTENT = 'PUBLISHED_CONTENT',
  COLLABORATIVE_CONTENT = 'COLLABORATIVE_CONTENT',
  QUESTION_ANSWER = 'QUESTION_ANSWER',
  MESSAGING = 'MESSAGING',
  CODE_REPOSITORY = 'CODE_REPOSITORY',
  CHANGE_MANAGEMENT = 'CHANGE_MANAGEMENT',
  PEOPLE = 'PEOPLE',
  EMAIL = 'EMAIL',
  SSO = 'SSO',
  ATS = 'ATS',
  KNOWLEDGE_HUB = 'KNOWLEDGE_HUB',
  EXTERNAL_SHORTCUT = 'EXTERNAL_SHORTCUT',
}


interface CustomDocument {
  name: string;
  displayName?: string;
  docCategory?: DocumentType;
}

export interface DataSource {
  name: string;
  displayName?: string;
  homeUrl?: string;
  iconUrl?: string;
  iconDarkUrl?: string;
  urlRegex?: string;
  connectorType?: ConnectorType;
  datasourceCategory?: DocumentType;
  isOnPrem?: boolean;
  isUserReferencedByEmail?: boolean;
  isEntityDatasource?: boolean;
  isTestDatasource?: boolean;
  objectDefinitions?: CustomDocument[];
}

export const addDataSource = async (source: DataSource) => post('adddatasource', source);

export const getDataSource = async (id: string) => get('getdatasourceconfig', { datasource: id });

export const ensureDataSource = async (source: DataSource) => {
  try {
    const existing = await getDataSource(source.name);
    return true;
  } catch {
    // Nothing
  }

  try {
    await addDataSource(source);
    return true;
  } catch (error: any) {
    console.error(error);
    console.warn(error.response.body);
  }

  return false;
};
