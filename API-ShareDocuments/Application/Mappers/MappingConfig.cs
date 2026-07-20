using Application.CQRS.Bookmarks.DTOs;
using Application.CQRS.Comments.DTOs;
using Application.CQRS.Reports.DTOs;
using Domain.Entities;
using Mapster;

namespace Application.Mappers
{
    public class MappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
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
        }
    }
}
