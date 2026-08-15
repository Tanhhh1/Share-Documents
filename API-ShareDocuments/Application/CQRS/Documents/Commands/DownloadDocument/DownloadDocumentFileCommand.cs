using Application.Common;
using Application.CQRS.Documents.DTOs;
using MediatR;

namespace Application.CQRS.Documents.Commands.DownloadDocument
{
    public class DownloadDocumentFileCommand : IRequest<ApiResult<DocumentFileUrlDto>>
    {
        public int DocumentId { get; set; }
    }
}
