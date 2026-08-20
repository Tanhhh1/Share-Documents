import type { AccessLevel } from "@/common/constants/access_level";
import type { DocumentStatus } from "@/common/constants/document_status";
import type { FileConversionStatus } from "@/common/constants/file_conversion_status";
import type { PageListParams } from "@/common/types/page_list_type";

export interface DocumentTagDto {
  id: number;
  name: string;
}

export interface DocumentDto {
  id: number;
  title: string;
  description: string | null;
  subjectId: number;
  subjectName: string;
  groupId: number | null;
  userId: number;
  userName: string;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  viewCount: number;
  downloadCount: number;
  isDeleted: boolean;

  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  thumbnailUrl: string | null;
  conversionStatus: FileConversionStatus;

  tags: string[];
  createdAt: string;
}

export interface DocumentDetailDto {
  id: number;
  title: string;
  description: string | null;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  subjectId: number;
  subjectName: string;
  groupId: number | null;
  userId: number;
  userName: string;
  isDeleted: boolean;

  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  s3Key: string;
  previewPdfKey: string | null;
  thumbnailKey: string | null;
  conversionStatus: FileConversionStatus;

  tags: DocumentTagDto[];
}

export interface DocumentFileUrlDto {
  fileName: string;
  signedUrl: string;
  expiresInSeconds: number;
  conversionStatus: FileConversionStatus;
}

export interface CreateDocumentRequest {
  title: string;
  description?: string;
  subjectId: number;
  groupId?: number;
  accessLevel: AccessLevel;
  tagIds: number[];
  file: File;
}

export interface UpdateDocumentRequest {
  id: number;
  title: string;
  description?: string;
  subjectId: number;
  groupId?: number;
  accessLevel: AccessLevel;
  tagIds: number[];
}

export interface RejectDocumentRequest {
  id: number;
  reason: string;
}

export interface DocumentFilterParams extends PageListParams {
  keyword?: string;
  subjectId?: number;
  tagIds?: number[];
  groupId?: number;
  status?: DocumentStatus;
  accessLevel?: AccessLevel;
  isDeleted?: boolean;
}

export interface PublishedDocumentFilterParams {
  keyword?: string;
  subjectId?: number;
  tagIds?: number[];
  groupId?: number;
  accessLevel?: AccessLevel;
  pageIndex: number;
  pageSize: number;
}