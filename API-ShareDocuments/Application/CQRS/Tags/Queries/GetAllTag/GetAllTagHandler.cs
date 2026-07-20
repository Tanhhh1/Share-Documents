using Application.Common;
using Application.CQRS.Tags.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Tags.Queries.GetAllTag
{
    public class GetAllTagHandler : IRequestHandler<GetAllTagQuery, ApiResult<PageList<TagDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetAllTagHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<PageList<TagDto>>> Handle(GetAllTagQuery request, CancellationToken cancellationToken)
        {
            var tag = _unitOfWork.TagRepository.GetByCondition().AsNoTracking();
            if (!string.IsNullOrEmpty(request.Search))
            {
                var keywords = request.Search.Trim();
                tag = tag.Where(t => t.Name.Contains(keywords));
            }

            if (request.IsDeleted.HasValue)
                tag = tag.Where(t => t.IsDeleted == request.IsDeleted.Value);

            var pageList = await PageList<TagDto>.ToPagedListAsync(
                tag.ProjectToType<TagDto>(),
                request.PageIndex,
                request.PageSize,
                cancellationToken
            );

            return ApiResult<PageList<TagDto>>.Success(pageList);
        }
    }
}
