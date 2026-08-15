using Application.CQRS.Documents.Commands.CreateDocument;
using FluentValidation;

namespace Application.CQRS.Documents.Validators
{
    public class CreateDocumentValidate : AbstractValidator<CreateDocumentCommand>
    {
        private static readonly string[] AllowedExtensions = { ".pdf", ".docx", ".pptx" };
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
                .Must(tagIds => tagIds == null || tagIds.Distinct().Count() == tagIds.Count)
                .WithMessage("Danh sách thẻ không được trùng lặp");

            RuleFor(x => x.File)
                .NotNull().WithMessage("Vui lòng chọn file tài liệu")
                .DependentRules(() =>
                {
                    RuleFor(x => x.File.Length)
                        .LessThanOrEqualTo(MaxFileSizeBytes)
                        .WithMessage($"Dung lượng file không được vượt quá {MaxFileSizeBytes / (1024 * 1024)}MB")
                        .OverridePropertyName("File");

                    RuleFor(x => x.File.FileName)
                        .Must(fileName => AllowedExtensions.Contains(Path.GetExtension(fileName).ToLowerInvariant()))
                        .WithMessage($"Chỉ chấp nhận file có định dạng: {string.Join(", ", AllowedExtensions)}")
                        .OverridePropertyName("File");
                });
        }
    }
}
