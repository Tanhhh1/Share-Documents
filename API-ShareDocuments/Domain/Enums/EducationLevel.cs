using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EducationLevel
    {
        TieuHoc = 1,
        THCS = 2,
        THPT = 3,
        DaiHoc = 4
    }
}
