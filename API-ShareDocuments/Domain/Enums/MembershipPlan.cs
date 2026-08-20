using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum MembershipPlan
    {
        Monthly = 1,
        Yearly = 2
    }
}
