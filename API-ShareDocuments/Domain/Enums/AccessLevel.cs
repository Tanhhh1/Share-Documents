using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum AccessLevel
    {
        Free = 1,
        Premium = 2
    }
}
