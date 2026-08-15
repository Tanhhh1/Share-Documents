import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { DocumentDto, DocumentDetailDto, DocumentFileUrlDto, DocumentFilterParams, CreateDocumentRequest, RejectDocumentRequest } from "./document_type";

export const documentApi = {
    getAll: async (params: DocumentFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<DocumentDto>>>(endpoints.document.list, { params });
        return data;
    },

    getMy: async (params: DocumentFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<DocumentDto>>>(endpoints.document.myList, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<ApiResult<DocumentDetailDto>>(endpoints.document.detail(id));
        return data;
    },

    getPreview: async (id: number) => {
        const { data } = await api.get<ApiResult<DocumentFileUrlDto>>(endpoints.document.preview(id));
        return data;
    },

    download: async (id: number) => {
        const { data } = await api.get<ApiResult<DocumentFileUrlDto>>(endpoints.document.download(id));
        return data;
    },

    approve: async (id: number) => {
        const { data } = await api.post<ApiResult<DocumentDto>>(endpoints.document.approve(id));
        return data;
    },

    reject: async (payload: RejectDocumentRequest) => {
        const { data } = await api.post<ApiResult<DocumentDto>>(endpoints.document.reject(payload.id), payload);
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.delete<ApiResult<DocumentDto>>(endpoints.document.delete(id));
        return data;
    },

    restore: async (id: number) => {
        const { data } = await api.post<ApiResult<DocumentDto>>(endpoints.document.restore(id));
        return data;
    },

    // BE nhận IFormFile File => bắt buộc gửi dạng multipart/form-data, không thể nhận JSON => tự tạo FormData và append từng field
    create: async (payload: CreateDocumentRequest) => {
        const formData = new FormData();
        formData.append("title", payload.title);
        if (payload.description) formData.append("description", payload.description);
        formData.append("subjectId", payload.subjectId.toString());
        if (payload.groupId) formData.append("groupId", payload.groupId.toString());
        formData.append("accessLevel", payload.accessLevel);
        payload.tagIds.forEach((id) => formData.append("tagIds", id.toString()));
        formData.append("file", payload.file);

        const { data } = await api.post<ApiResult<DocumentDetailDto>>(endpoints.document.create, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },
};