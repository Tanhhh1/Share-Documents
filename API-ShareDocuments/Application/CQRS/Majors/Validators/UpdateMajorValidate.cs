using Application.CQRS.Majors.Commands.UpdateMajor;
using FluentValidation;

namespace Application.CQRS.Majors.Validators
{
    public class UpdateMajorValidate : AbstractValidator<UpdateMajorCommand>
    {
        public UpdateMajorValidate() 
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã ngành học không hợp lệ");

            RuleFor(x => x.FacultyId)
                .NotEmpty().WithMessage("Khoa không được để trống");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên chuyên ngành không được để trống")
                .MaximumLength(150).WithMessage("Tên chuyên ngành không được vượt quá 150 ký tự");
        }
    }
}
