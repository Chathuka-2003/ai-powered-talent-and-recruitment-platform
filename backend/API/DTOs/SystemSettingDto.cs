namespace API.DTOs;

/// <summary>
/// Data Transfer Object (DTO) used to represent
/// a system configuration setting.
/// </summary>
public class SystemSettingDto
{
    /// <summary>
    /// Gets or sets the unique key that identifies the system setting.
    /// </summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the value associated with the system setting key.
    /// </summary>
    public string Value { get; set; } = string.Empty;
}