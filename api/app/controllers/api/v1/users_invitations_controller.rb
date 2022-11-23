class Api::V1::UsersInvitationsController < Devise::InvitationsController
  def edit
    set_minimum_password_length
    resource.invitation_token = params[:invitation_token]
    redirect_to "#{ENV["FRONT_END_URL"]}/auth/accept-invitation?invitation_token=#{params[:invitation_token]}"
  end
end
