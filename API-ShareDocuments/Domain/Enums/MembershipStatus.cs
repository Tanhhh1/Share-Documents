using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum MembershipStatus
    {
        Active = 1,
        Expired = 2,
        Cancelled = 3 
    }
}
