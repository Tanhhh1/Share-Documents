import { useProfile, useUpdateProfile, useChangePassword } from "@/features/profile/use_profile";
import { ProfileInfoForm } from "@/features/profile/components/profile_form";
import { ChangePasswordForm } from "@/features/profile/components/change_pw_form";
import { useFormAction } from "@/common/hooks/use_form";
import type { UpdateInformationRequest, UpdatePasswordRequest } from "@/features/profile/profile_type";

export default function ProfilePage() {
    const { data } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const changePasswordMutation = useChangePassword();

    const profile = data?.result ?? undefined;

    const infoAction = useFormAction<UpdateInformationRequest>(
        updateProfileMutation.mutate,
        "Cập nhật thông tin cá nhân thành công!"
    );

    const passwordAction = useFormAction<UpdatePasswordRequest>(
        changePasswordMutation.mutate,
        "Đổi mật khẩu thành công!"
    );

    return (
        <div className="client-page">
            <div className="client-page-header">
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
                            <span>
                                Cập nhật: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString("vi-VN") : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-main-content">
                    <ProfileInfoForm
                        profile={profile}
                        isLoading={updateProfileMutation.isPending}
                        apiErrors={infoAction.errors}
                        apiSuccess={infoAction.success}
                        onSubmit={infoAction.submit}
                    />

                    <ChangePasswordForm
                        isLoading={changePasswordMutation.isPending}
                        apiErrors={passwordAction.errors}
                        apiSuccess={passwordAction.success}
                        onSubmit={passwordAction.submit}
                    />
                </div>
            </div>
        </div>
    );
}