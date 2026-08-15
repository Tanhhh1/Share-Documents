import { useState } from "react";
import { useProfile } from "@/features/profile/use_profile";
import { useUpdateProfile, useChangePassword } from "@/features/profile/use_profile";
import { ProfileInfoForm } from "@/features/profile/components/profile_form";
import { ChangePasswordForm } from "@/features/profile/components/change_pw_form";
import type { UpdateInformationRequest, UpdatePasswordRequest } from "@/features/profile/profile_type";
import type { FieldError } from "@/common/types/api_result_type";

import "@/styles/admin/profile.css";

export default function ProfilePage() {
    const [infoSuccess, setInfoSuccess] = useState<string | null>(null);
    const [infoErrors, setInfoErrors] = useState<FieldError[] | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordErrors, setPasswordErrors] = useState<FieldError[] | null>(null);

    const { data, isLoading: isProfileLoading } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const changePasswordMutation = useChangePassword();

    const profile = data?.result ?? undefined;

    const handleUpdateInfo = (payload: UpdateInformationRequest) => {
        setInfoErrors(null);
        setInfoSuccess(null);
        updateProfileMutation.mutate(payload, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    setInfoSuccess("Cập nhật thông tin cá nhân thành công!");
                } else {
                    setInfoErrors(result.errors ?? null);
                }
            },
        });
    };

    const handleChangePassword = (payload: UpdatePasswordRequest) => {
        setPasswordErrors(null);
        setPasswordSuccess(null);
        changePasswordMutation.mutate(payload, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    setPasswordSuccess("Đổi mật khẩu thành công!");
                } else {
                    setPasswordErrors(result.errors ?? null);
                }
            },
        });
    };

    if (isProfileLoading) {
        return <div className="page"><p>Đang tải thông tin cá nhân...</p></div>;
    }

    return (
        <div className="page">
            <div className="page-header">
                <h2>Hồ Sơ Cá Nhân</h2>
            </div>

            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-large">
                            {(profile?.fullName ?? "U").charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <h3 className="profile-user-name">{profile?.fullName ?? "Người dùng"}</h3>
                    <span className="profile-user-role">@{profile?.userName}</span>

                    <div className="profile-stats">
                        <div className="profile-stat-item">
                            <i className="bx bx-envelope"></i>
                            <span>{profile?.email}</span>
                        </div>
                        <div className="profile-stat-item">
                            <i className="bx bx-phone"></i>
                            <span>{profile?.phoneNumber || "Chưa cập nhật SĐT"}</span>
                        </div>
                        <div className="profile-stat-item">
                            <i className="bx bx-calendar"></i>
                            <span>Cập nhật: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString("vi-VN") : "N/A"}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-main-content">
                    <ProfileInfoForm
                        profile={profile}
                        isLoading={updateProfileMutation.isPending}
                        apiErrors={infoErrors}
                        apiSuccess={infoSuccess}
                        onSubmit={handleUpdateInfo}
                    />

                    <ChangePasswordForm
                        isLoading={changePasswordMutation.isPending}
                        apiErrors={passwordErrors}
                        apiSuccess={passwordSuccess}
                        onSubmit={handleChangePassword}
                    />
                </div>
            </div>
        </div>
    );
}