using Application.CQRS.Comments.Commands.CreateComment;
using FluentValidation;

namespace Application.CQRS.Comments.Validators
{
    public class CreateCommentValidator : AbstractValidator<CreateCmtCommand>
    {
        public CreateCommentValidator()
        {
            RuleFor(x => x.DocumentId)
                .GreaterThan(0).WithMessage("Tài liệu không hợp lệ");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Nội dung bình luận không được để trống")
                .MaximumLength(2000).WithMessage("Nội dung bình luận không được vượt quá 2000 ký tự");

            RuleFor(x => x.ParentCommentId)
                .GreaterThan(0).WithMessage("Bình luận cha không hợp lệ")
                .When(x => x.ParentCommentId.HasValue);
        }
    }
}
