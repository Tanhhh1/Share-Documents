using Application.Common;
using Application.CQRS.Documents.DTOs;
using MediatR;

namespace Application.CQRS.Documents.Queries.GetByDocumentId
{
    public class GetByDocumentIdQuery : IRequest<ApiResult<DocumentDetailDto>>
    {
        public int Id { get; set; }
    }
}
