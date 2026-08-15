using Application.Common;
using Application.CQRS.Documents.DTOs;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.CQRS.Documents.Commands.CreateDocument
{
    public class CreateDocumentCommand : IRequest<ApiResult<DocumentDetailDto>>
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int SubjectId { get; set; }
        public int? GroupId { get; set; }
        public AccessLevel AccessLevel { get; set; } = AccessLevel.Free;
        public List<int> TagIds { get; set; } = new();
        public IFormFile File { get; set; } = null!;
    }
}
