using Application.Common;
using Application.CQRS.Faculties.DTOs;
using Application.Interfaces.UnitOfWork;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.CQRS.Faculties.Queries.GetByFacultyId
{
    public class GetByFacultyHandler : IRequestHandler<GetByFacultyIdQuery, ApiResult<FacultyDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetByFacultyHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResult<FacultyDto>> Handle(GetByFacultyIdQuery request, CancellationToken cancellationToken)
        {
            var faculty = await _unitOfWork.FacultyRepository
                .GetByCondition(f => f.Id == request.Id)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken);
            if(faculty is null)
                return ApiResult<FacultyDto>.Failure("Khoa không tồn tại");

            var facultyDto = faculty.Adapt<FacultyDto>();
            return ApiResult<FacultyDto>.Success(facultyDto);
        }
    }
}
