using Application.Common;
using Application.CQRS.Documents.DTOs;
using MediatR;

namespace Application.CQRS.Documents.Commands.AproveDocument
{
    public class ApproveDocumentCommand : IRequest<ApiResult<DocumentDto>>
    {
        public int Id { get; set; }
    }
}
