using Application.CQRS.Documents.Commands.CreateDocument;
using FluentValidation;

namespace Application.CQRS.Documents.Validators
{
    public class CreateDocumentValidate : AbstractValidator<CreateDocumentCommand>
    {
        private static readonly string[] AllowedExtensions = { ".pdf", ".doc", ".docx", ".ppt", ".pptx" };
        private const long MaxFileSizeBytes = 20 * 1024 * 1024;

        public CreateDocumentValidate()
        {
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

            RuleFor(x => x.Files)
                .NotNull().WithMessage("Vui lòng chọn ít nhất 1 file")
                .Must(files => files.Count >= 1).WithMessage("Tài liệu phải có ít nhất 1 file")
                .Must(files => files.Count <= 3).WithMessage("Tài liệu chỉ được phép tối đa 3 file");

            RuleForEach(x => x.Files).ChildRules(file =>
            {
                file.RuleFor(f => f.Length)
                    .LessThanOrEqualTo(MaxFileSizeBytes)
                    .WithMessage($"Mỗi file không được vượt quá {MaxFileSizeBytes / (1024 * 1024)}MB");

                file.RuleFor(f => f.FileName)
                    .Must(fileName => AllowedExtensions.Contains(Path.GetExtension(fileName).ToLowerInvariant()))
                    .WithMessage($"Chỉ chấp nhận file có định dạng: {string.Join(", ", AllowedExtensions)}");
            });
        }
    }
}
