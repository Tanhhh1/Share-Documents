using Application.CQRS.Majors.Commands.CreateMajor;
using FluentValidation;

namespace Application.CQRS.Majors.Validators
{
    public class CreateMajorValidate : AbstractValidator<CreateMajorCommand>
    {
        public CreateMajorValidate()
        {
            RuleFor(x => x.FacultyId)
                .NotEmpty().WithMessage("Khoa không được để trống");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên chuyên ngành không được để trống")
                .MaximumLength(150).WithMessage("Tên chuyên ngành không được vượt quá 150 ký tự");
        }
    }
}
