using Application.Interfaces.Services;

namespace Infrastructure.Services.Email.Templates
{
    public static class PaymentSuccessTemplate
    {
        public static string Build(PaymentSuccessEmailModel model)
        {
            return $@"
                <div style='font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;'>
                    <h2 style='color: #2e7d32;'>Thanh toán thành công!</h2>
                    <p>Xin chào <strong>{model.UserFullName}</strong>,</p>
                    <p>Bạn đã nâng cấp thành công gói <strong>{model.PlanName}</strong>. Dưới đây là chi tiết giao dịch:</p>
                    <table style='width: 100%; border-collapse: collapse; margin: 16px 0;'>
                        <tr>
                            <td style='padding: 8px; border-bottom: 1px solid #eee;'>Mã đơn hàng</td>
                            <td style='padding: 8px; border-bottom: 1px solid #eee; text-align: right;'>{model.OrderCode}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px; border-bottom: 1px solid #eee;'>Số tiền</td>
                            <td style='padding: 8px; border-bottom: 1px solid #eee; text-align: right;'>{model.Amount:N0} VND</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px; border-bottom: 1px solid #eee;'>Ngày bắt đầu</td>
                            <td style='padding: 8px; border-bottom: 1px solid #eee; text-align: right;'>{model.StartDate:dd/MM/yyyy}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px;'>Ngày hết hạn</td>
                            <td style='padding: 8px; text-align: right;'>{model.EndDate:dd/MM/yyyy}</td>
                        </tr>
                    </table>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của Share Documents!</p>
                </div>";
        }
    }
}
