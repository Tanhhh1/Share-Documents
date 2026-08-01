using Application.Interfaces.Services;
using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class MemberService : IMemberService
    {
        private readonly UserManager<User> _userManager;

        public MemberService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> IsActiveMemberAsync(int userId, CancellationToken cancellationToken = default)
        {
            var memberInfo = await _userManager.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.IsMember, u.MemberExpiresAt })
                .FirstOrDefaultAsync(cancellationToken);

            if (memberInfo is null) return false;

            return memberInfo.IsMember
                && (memberInfo.MemberExpiresAt is null || memberInfo.MemberExpiresAt > DateTime.UtcNow);
        }
    }
}
