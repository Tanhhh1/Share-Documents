using Application.Interfaces.Services;

namespace Infrastructure.Services.Email.Templates
{
    public static class OTPTemplate
    {
        public static string Build(OtpEmailModel model)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;'>
                    <h2 style='color: #1565c0;'>Yêu cầu đặt lại mật khẩu</h2>
                    <p>Xin chào <strong>{model.UserFullName}</strong>,</p>
                    <p>Mã OTP để đặt lại mật khẩu của bạn là:</p>
                    <div style='font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; margin: 24px 0; color: #1565c0;'>
                        {model.Otp}
                    </div>
                    <p>Mã có hiệu lực trong <strong>5 phút</strong>. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                </div>";
        }
    }
}
