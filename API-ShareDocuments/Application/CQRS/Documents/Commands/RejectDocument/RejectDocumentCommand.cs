using Application.Common;
using Application.CQRS.Documents.DTOs;
using MediatR;

namespace Application.CQRS.Documents.Commands.RejectDocument
{
    public class RejectDocumentCommand : IRequest<ApiResult<DocumentDto>>
    {
        public int Id { get; set; }
        public string Reason { get; set; } = null!;
    }
}
