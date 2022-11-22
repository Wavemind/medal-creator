class UsersInvitationsController < Devise::InvitationsController
  def edit
    sign_out send("current_#{resource_name}") if send("#{resource_name}_signed_in?")
    set_minimum_password_length
    resource.invitation_token = params[:invitation_token]
    redirect_to "http://localhost:3001/users/invitation/accept?invitation_token=#{params[:invitation_token]}"
  end

  def update
    super do |resource|
      if resource.errors.empty?
        render json: { status: 'Invitation Accepted!' }, status: 200 and return
      else
        render json: resource.errors, status: 401 and return
      end
    end
  end
end
