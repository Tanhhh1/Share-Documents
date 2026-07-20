using Application.Common;
using Application.CQRS.Majors.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Majors.Queries.GetAllMajor
{
    public class GetAllMajorHandler : IRequestHandler<GetAllMajorQuery, ApiResult<PageList<MajorDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetAllMajorHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<PageList<MajorDto>>> Handle(GetAllMajorQuery request, CancellationToken cancellationToken)
        {
            var major = _unitOfWork.MajorRepository.GetByCondition().AsNoTracking();
            if (!string.IsNullOrEmpty(request.Search))
            {
                var keywords = request.Search.Trim();
                major = major.Where(m => m.Name.Contains(keywords));
            }

            if(request.FacultyId.HasValue)
                major = major.Where(m => m.FacultyId == request.FacultyId.Value);
            
            if(request.IsActive.HasValue)
                major = major.Where(m => m.IsActive == request.IsActive.Value);

            var pageList = await PageList<MajorDto>.ToPagedListAsync(
                major.ProjectToType<MajorDto>(),
                request.PageSize,
                request.PageIndex,
                cancellationToken
            );

            return ApiResult<PageList<MajorDto>>.Success(pageList);
        }
    }
}
