using Application.CQRS.Documents.Commands.UpdateDocument;
using FluentValidation;

namespace Application.CQRS.Documents.Validators
{
    public class UpdateDocumentValidate : AbstractValidator<UpdateDocumentCommand>
    {
        public UpdateDocumentValidate()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Mã tài liệu không hợp lệ");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề tài liệu không được để trống")
                .MaximumLength(255).WithMessage("Tiêu đề không được vượt quá 255 ký tự");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự");

            RuleFor(x => x.SubjectId)
                .GreaterThan(0).WithMessage("Môn học không được để trống");

            RuleFor(x => x.TagIds)
                .Must(tagIds => tagIds.Distinct().Count() == tagIds.Count)
                .WithMessage("Danh sách thẻ không được trùng lặp");
        }
    }
}
