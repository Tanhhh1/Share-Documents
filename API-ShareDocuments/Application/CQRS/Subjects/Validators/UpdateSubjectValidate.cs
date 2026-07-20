using Application.CQRS.Subjects.Commands.UpdateSubject;
using FluentValidation;

namespace Application.CQRS.Subjects.Validators
{
    public class UpdateSubjectValidate : AbstractValidator<UpdateSubjectCommand>
    {
        public UpdateSubjectValidate() 
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã môn học không hợp lệ");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên môn học không được để trống")
                .MaximumLength(100).WithMessage("Tên môn học không được vượt quá 100 ký tự");

            RuleFor(x => x.EducationLevelId)
                .GreaterThan(0).WithMessage("Mã cấp bậc giáo dục không hợp lệ");
        }
    }
}
