using Application.Common;
using Application.CQRS.Documents.DTOs;
using MediatR;

namespace Application.CQRS.Documents.Commands.RestoreDocument
{
    public class RestoreDocumentCommand : IRequest<ApiResult<DocumentDto>>
    {
        public int Id { get; set; }
    }
}
