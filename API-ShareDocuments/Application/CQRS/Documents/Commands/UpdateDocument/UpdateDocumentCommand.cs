using Application.Common;
using Application.CQRS.Documents.DTOs;
using MediatR;

namespace Application.CQRS.Documents.Commands.UpdateDocument
{
    public class UpdateDocumentCommand : IRequest<ApiResult<DocumentDetailDto>>
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int SubjectId { get; set; }
        public int? GroupId { get; set; }
        public List<int> TagIds { get; set; } = new();
    }
}