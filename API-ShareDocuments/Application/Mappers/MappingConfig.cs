using Application.CQRS.Account.DTOs;
using Application.CQRS.Bookmarks.DTOs;
using Application.CQRS.Comments.DTOs;
using Application.CQRS.Documents.Commands.CreateDocument;
using Application.CQRS.Documents.DTOs;
using Application.CQRS.Members.DTOs;
using Application.CQRS.Notifications.DTOs;
using Application.CQRS.Payments.DTOs;
using Application.CQRS.Reports.DTOs;
using Domain.Entities;
using Domain.Enums;
using Domain.Identity;
using Mapster;

namespace Application.Mappers
{
    public class MappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<User, AccountDto>()
                .Map(dest => dest.Roles,
                     src => src.UserRoles.Select(ur => ur.Role.Name!).ToList());

            config.NewConfig<CreateDocumentCommand, Document>()
                .Ignore(dest => dest.Files)
                .Ignore(dest => dest.Tags);

            config.NewConfig<Bookmark, BookmarkDto>()
               .Map(dest => dest.DocumentTitle, src => src.Document.Title);

            config.NewConfig<Comment, CommentDto>()
                .Map(dest => dest.UserName, src => src.User.UserName)
                .Map(dest => dest.Replies, src => new List<CommentDto>());

            config.NewConfig<Comment, ListCommentDto>()
                .Map(dest => dest.DocumentTitle, src => src.Document.Title)
                .Map(dest => dest.UserName, src => src.User.UserName);

            config.NewConfig<Report, ReportDto>()
                .Map(dest => dest.DocumentTitle, src => src.Document.Title)
                .Map(dest => dest.UserName, src => src.User.UserName);

            config.NewConfig<Document, DocumentDto>()
                .Map(dest => dest.SubjectName, src => src.Subject.Name)
                .Map(dest => dest.UserName, src => src.User.UserName)
                .Map(dest => dest.Tags, src => src.Tags.Select(t => t.Name).ToList());

            config.NewConfig<Document, DocumentDetailDto>()
                .Map(dest => dest.SubjectName, src => src.Subject.Name)
                .Map(dest => dest.UserName, src => src.User.UserName);

            config.NewConfig<Tag, DocumentTagDto>();

            config.NewConfig<DocumentFile, DocumentFileDto>()
                 .Map(dest => dest.HasPreview, src => src.PreviewPdfKey != null);

            config.NewConfig<Payment, PaymentDto>();

            config.NewConfig<Notification, NotificationDto>();

            config.NewConfig<Membership, MembershipDto>()
                .Map(dest => dest.IsActive,
                    src => src.Status == MembershipStatus.Active && src.EndDate > DateTime.UtcNow)
                .Map(dest => dest.DaysRemaining,
                    src => src.EndDate > DateTime.UtcNow ? (int)(src.EndDate - DateTime.UtcNow).TotalDays : 0);
        }
    }
}

