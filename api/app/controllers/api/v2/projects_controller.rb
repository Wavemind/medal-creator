class Api::V2::ProjectsController < ActionController::API
  def index
    render json: Project.all.select(:id, :name, :archived, :created_at, :updated_at)
  end

  # POST /projects/:id/emergency_content
  # @params id [Integer]
  # Send emergency_content unless its version is the same
  def emergency_content
    project = Project.find_by(id: params[:id])

    if project.nil?
      render json: { errors: t('api.errors.algorithms.invalid_project') }, status: :unprocessable_entity
    elsif project.emergency_content_version == params[:emergency_content_version].to_i
      render json: {}, status: 204
    else
      render json: project.as_json(only: %i[emergency_content_translations emergency_content_version])
    end
  end
end
