using Application.CQRS.Faculties.Commands.UpdateFaculty;
using FluentValidation;

namespace Application.CQRS.Faculties.Validators
{
    public class UpdateFacultyValidate : AbstractValidator<UpdateFacultyCommand>
    {
        public UpdateFacultyValidate()
        {
            RuleFor(x => x.Id)
               .GreaterThan(0).WithMessage("Mã khoa không hợp lệ");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên khoa không được để trống")
                .MaximumLength(50).WithMessage("Tên khoa không vượt quá 50 ký tự");
        }
    }
}
