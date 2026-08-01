using Application.Common;
using Application.CQRS.Documents.DTOs;
using MediatR;

namespace Application.CQRS.Documents.Queries.GetDocumentPreview
{
    public class GetDocumentPreviewQuery : IRequest<ApiResult<DocumentFileUrlDto>>
    {
        public int DocumentId { get; set; }
        public int FileId { get; set; }
    }
}
