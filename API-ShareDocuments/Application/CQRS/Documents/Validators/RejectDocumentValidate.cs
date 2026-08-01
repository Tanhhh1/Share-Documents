using Application.CQRS.Documents.Commands.RejectDocument;
using FluentValidation;

namespace Application.CQRS.Documents.Validators
{
    public class RejectDocumentValidate : AbstractValidator<RejectDocumentCommand>
    {
        public RejectDocumentValidate()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã tài liệu không hợp lệ");

            RuleFor(x => x.Reason)
                .NotEmpty().WithMessage("Vui lòng nhập lý do từ chối")
                .MaximumLength(500).WithMessage("Lý do từ chối không được vượt quá 500 ký tự");
        }
    }
}
