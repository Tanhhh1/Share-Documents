using Application.CQRS.Faculties.Commands.CreateFaculty;
using FluentValidation;

namespace Application.CQRS.Faculties.Validators
{
    public class CreateFacultyValidate : AbstractValidator<CreateFacultyCommand>
    {
        public CreateFacultyValidate()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên khoa không được để trống")
                .MaximumLength(50).WithMessage("Tên khoa không vượt quá 50 ký tự");
        }
    }
}
