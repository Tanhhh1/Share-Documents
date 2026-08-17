import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/client/home.css";

const ABOUT_SECTIONS = [
    {
        key: "system",
        title: "Hệ thống tài liệu đa dạng",
        icon: "bx-library",
        desc: "Cung cấp kho tài liệu phong phú từ bài giảng, đề thi, giáo trình đến đồ án tốt nghiệp thuộc nhiều lĩnh vực chuyên ngành khác nhau.",
    },
    {
        key: "community",
        title: "Cộng đồng chia sẻ tri thức",
        icon: "bx-group",
        desc: "Nơi kết nối các bạn học sinh, sinh viên và giảng viên cùng trao đổi, đóng góp và truy cập nguồn tri thức hoàn toàn dễ dàng.",
    },
];

const STEPS = [
    { icon: "bx-search-alt", title: "Tìm kiếm", desc: "Nhập từ khóa hoặc chọn danh mục để tìm tài liệu phù hợp" },
    { icon: "bx-show", title: "Xem trước", desc: "Xem trước nội dung tài liệu trước khi tải về" },
    { icon: "bx-download", title: "Tải xuống", desc: "Tải về miễn phí hoặc mở khóa tài liệu Premium" },
];

export default function HomePage() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = keyword.trim();
        navigate(trimmed ? `/document?keyword=${encodeURIComponent(trimmed)}` : "/document");
    };

    return (
        <div className="home-page">
            <section className="home-hero">
                <div className="home-hero-inner">
                    <span className="home-hero-badge">
                        <i className="bx bx-folder-open"></i>
                        Kho tài liệu học tập lớn nhất
                    </span>
                    <h1 className="home-hero-title">
                        Tìm tài liệu bạn cần <br /> chỉ trong vài giây
                    </h1>
                    <p className="home-hero-subtitle">
                        Giáo trình, đề thi, đồ án và tài liệu tham khảo từ hàng nghìn thành viên chia sẻ mỗi ngày
                    </p>

                    <form className="home-search-form" onSubmit={handleSearch}>
                        <i className="bx bx-search home-search-icon"></i>
                        <input type="text" className="home-search-input" placeholder="Nhập tên tài liệu, môn học, từ khóa..."
                            value={keyword}  onChange={(e) => setKeyword(e.target.value)} />
                        <button type="submit" className="home-search-btn">
                            Tìm kiếm
                        </button>
                    </form>
                </div>
            </section>

            <section className="home-section home-section-muted">
                <div className="home-section-inner">
                    <div className="home-section-header">
                        <h2 className="home-section-title">Cách thức hoạt động</h2>
                        <p className="home-section-subtitle">Chỉ với 3 bước đơn giản</p>
                    </div>

                    <div className="home-steps">
                        {STEPS.map((step, index) => (
                            <div key={step.title} className="home-step-item">
                                <span className="home-step-number">{index + 1}</span>
                                <span className="home-step-icon">
                                    <i className={`bx ${step.icon}`}></i>
                                </span>
                                <h3 className="home-step-title">{step.title}</h3>
                                <p className="home-step-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-section">
                <div className="home-section-inner">
                    <div className="home-section-header">
                        <h2 className="home-section-title">Về hệ thống của chúng tôi</h2>
                        <p className="home-section-subtitle">Nền tảng hỗ trợ học tập và nghiên cứu hàng đầu</p>
                    </div>

                    <div className="home-about-grid">
                        {ABOUT_SECTIONS.map((item) => (
                            <div key={item.key} className="home-about-card">
                                <span className="home-about-icon">
                                    <i className={`bx ${item.icon}`}></i>
                                </span>
                                <h3 className="home-about-title">{item.title}</h3>
                                <p className="home-about-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}