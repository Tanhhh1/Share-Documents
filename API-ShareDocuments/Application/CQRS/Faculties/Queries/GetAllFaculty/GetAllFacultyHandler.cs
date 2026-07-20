using Application.Common;
using Application.CQRS.Faculties.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Faculties.Queries.GetAllFaculty
{
    public class GetAllFacultyHandler : IRequestHandler<GetAllFacultyQuery, ApiResult<PageList<FacultyDto>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetAllFacultyHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<PageList<FacultyDto>>> Handle(GetAllFacultyQuery request, CancellationToken cancellationToken)
        {
            var faculty = _unitOfWork.FacultyRepository.GetByCondition().AsNoTracking();
            if(!string.IsNullOrEmpty(request.Search))
            {
                var keywords = request.Search.Trim();
                faculty = faculty.Where(f => f.Name.Contains(keywords));
            }

            if(request.IsActive.HasValue)
                faculty = faculty.Where(f => f.IsActive == request.IsActive.Value);

            var pageList = await PageList<FacultyDto>.ToPagedListAsync(
                faculty.ProjectToType<FacultyDto>(),
                request.PageNumber,
                request.PageSize,
                cancellationToken
            );
            return ApiResult<PageList<FacultyDto>>.Success(pageList);
        }
    }
}
