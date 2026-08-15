using Application.Common;
using Application.CQRS.Documents.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.CQRS.Documents.Queries.GetAllDocument
{
    public class GetAllDocumentQuery : IRequest<ApiResult<PageList<DocumentDto>>>
    {
        public string? Keyword { get; set; }
        public int? SubjectId { get; set; }
        public List<int> TagIds { get; set; } = new();
        public int? GroupId { get; set; }
        public DocumentStatus? Status { get; set; }
        public AccessLevel? AccessLevel { get; set; }
        public bool? IsDeleted { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
