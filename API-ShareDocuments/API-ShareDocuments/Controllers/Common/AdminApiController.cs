using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.Common
{
    [ApiController]
    [Authorize(Roles = "Admin, Moderator")]
    [Route("api/v{v:apiVersion}/admin/[controller]")]
    public class AdminApiController : ControllerBase
    {
    }
}
