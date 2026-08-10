using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum DocumentStatus
    {
        Pending = 1,
        Published = 2, 
        Rejected = 3,
        Hidden = 4
    }
}
