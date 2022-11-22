import { post } from './api.js';
import { FORCE_REUPLOAD } from '../constants.js';

interface ContentDefinition {
  mimeType?: string;
  textContent?: string;
  binaryContent?: string;
}

interface UserReference {
  email?: string;
  datasourceUserId?: string;
  name?: string;
}

export interface DocumentPermissions {
  allowedUsers?: UserReference[];
  allowedGroups?: string[];
  allowAnonymousAccess?: boolean;
  allowAllDatasourceUsersAccess?: boolean;
}

interface DocumentInteractions {
  numView?: number;
  numLike?: number;
  numComments?: number;
}

export interface Document {
  datasource?: string;
  id: string;
  title: string;
  viewURL: string;
  summary?: ContentDefinition;
  body?: ContentDefinition;
  author?: UserReference;
  owner?: UserReference;
  permissions?: DocumentPermissions;
  createdAt?: number;
  updatedAt?: number;
  updatedBy?: UserReference;
  tags?: string[];
  interactions?: DocumentInteractions;
  status?: string;
}

interface DocumentWithDatasource extends Document {
  datasource: string;
}

interface BulkIndexContainer {
  uploadId: string;
  documents: Document[];
  datasource: string;
  isFirstPage: boolean;
  isLastPage: boolean;
  forceRestartUpload?: boolean;
}

export enum PAGE {
  first,
  last,
}

const attachDatasource = (document: Document, datasource: string): DocumentWithDatasource => ({
  ...document,
  datasource,
});

const attachDatasourceTo =
  (datasource: string) =>
  (document: Document): DocumentWithDatasource => ({ ...document, datasource });

export const getDocumentCount = async (datasource: string) =>
  post('getdocumentcount', { datasource });

export const forceProcessing = async (datasource: string) =>
  post('processalldocuments', { datasource });

export const addDocument = async (document: Document, datasource: string) =>
  post('indexdocument', { document: attachDatasource(document, datasource) });

export const addDocumentTo = (datasource: string) => async (document: Document) =>
  addDocument(document, datasource);

const attachForceRepload = (body: BulkIndexContainer): BulkIndexContainer => {
  if (!FORCE_REUPLOAD) {
    return body;
  }

  return {
    ...body,
    forceRestartUpload: body.isFirstPage,
  };
};

export const syncDocuments = async (
  documents: Document[],
  datasource: string,
  uploadId: string,
  currentPage?: PAGE,
) => {
  try {
    await post(
      'bulkindexdocuments',
      attachForceRepload({
        uploadId,
        documents: documents.map(attachDatasourceTo(datasource)),
        datasource,
        isFirstPage: currentPage === PAGE.first,
        isLastPage: currentPage === PAGE.last,
      }),
    );
  } catch (error: any) {
    console.error('Bulk document upload to Glean failed');
    console.trace(error?.response?.body);
  }
};
