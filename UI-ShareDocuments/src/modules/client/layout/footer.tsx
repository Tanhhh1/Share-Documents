import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="client-footer">
            <div className="client-footer-inner">
                <div className="client-footer-brand">
                    <div className="client-footer-logo">
                        <span className="client-footer-logo-box">
                            <i className="bx bx-folder"></i>
                        </span>
                        <span className="client-footer-title">DocxBase</span>
                    </div>
                    <p className="client-footer-desc">
                        Nền tảng chia sẻ tài liệu học tập, giáo trình và tài nguyên tham khảo dành cho học sinh, sinh viên.
                    </p>
                    <div className="client-footer-socials">
                        <a href="#" className="client-footer-social-link" aria-label="Facebook">
                            <i className="bx bxl-facebook"></i>
                        </a>
                        <a href="#" className="client-footer-social-link" aria-label="Youtube">
                            <i className="bx bxl-youtube"></i>
                        </a>
                        <a href="#" className="client-footer-social-link" aria-label="Instagram">
                            <i className="bx bxl-instagram"></i>
                        </a>
                    </div>
                </div>

                <div className="client-footer-col">
                    <h4 className="client-footer-heading">Khám phá</h4>
                    <Link to="/document" className="client-footer-link">Tài liệu</Link>
                    <Link to="/group" className="client-footer-link">Nhóm tài liệu</Link>
                    <Link to="/upload" className="client-footer-link">Tải lên tài liệu</Link>
                    <Link to="/membership" className="client-footer-link">Gói Member</Link>
                </div>

                <div className="client-footer-col">
                    <h4 className="client-footer-heading">Hỗ trợ</h4>
                    <Link to="/help" className="client-footer-link">Trung tâm trợ giúp</Link>
                    <Link to="/terms" className="client-footer-link">Điều khoản sử dụng</Link>
                    <Link to="/privacy" className="client-footer-link">Chính sách bảo mật</Link>
                    <Link to="/contact" className="client-footer-link">Liên hệ</Link>
                </div>

                <div className="client-footer-col">
                    <h4 className="client-footer-heading">Liên hệ</h4>
                    <div className="client-footer-contact-item">
                        <i className="bx bx-envelope"></i>
                        <span>support@docxbase.vn</span>
                    </div>
                    <div className="client-footer-contact-item">
                        <i className="bx bx-phone"></i>
                        <span>1900 1234</span>
                    </div>
                    <div className="client-footer-contact-item">
                        <i className="bx bx-map"></i>
                        <span>Hà Nội, Việt Nam</span>
                    </div>
                </div>
            </div>

            <div className="client-footer-bottom">
                <span>© {new Date().getFullYear()} DocxBase. All rights reserved.</span>
            </div>
        </footer>
    );
}