using Application.CQRS.DocumentGroups.Commands.RejectGroup;
using FluentValidation;

namespace Application.CQRS.DocumentGroups.Validators
{
    public class RejectGroupValidate : AbstractValidator<RejectGroupCommand>
    {
        public RejectGroupValidate()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã nhóm chủ đề không hợp lệ");

            RuleFor(x => x.Reason)
                .NotEmpty().WithMessage("Vui lòng nhập lý do từ chối")
                .MaximumLength(500).WithMessage("Lý do từ chối không được vượt quá 500 ký tự");
        }
    }
}
