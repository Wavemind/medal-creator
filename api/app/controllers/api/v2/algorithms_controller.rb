class Api::V2::AlgorithmsController < ActionController::API

  def index
    project = Project.find_by_id(params[:project_id])
    if project
      render json: project.algorithms.select(:id, :name, :mode, :status, :created_at, :updated_at, :project_id)
    else
      render json: { errors: I18n.t('api.errors.algorithms.invalid_project') }, status: :unprocessable_entity
    end
  end

  def show
    algorithm = Algorithm.find_by_id(params[:id])
    if algorithm
      medal_r_json_version = params[:json_version]
      if medal_r_json_version.to_i == algorithm.medal_r_json_version
        render json: {}, status: 204
      else
        render json: algorithm.as_json
      end
    else
      render json: { errors: I18n.t('api.errors.algorithms.invalid_algorithm') }, status: :unprocessable_entity
    end
  end

  # GET /algorithms/:id/medal_data_config
  # Get the MedAL-data config within basic questions, medal-data related variables
  def medal_data_config
    algorithm = Algorithm.find_by(id: params[:id])
    if algorithm.present?
      config = algorithm.project.medal_r_config['basic_questions'].merge(algorithm.project.medal_r_config['optional_basic_questions'])

      algorithm.medal_data_config_variables.each do |var|
        config[var.api_key] = var.variable_id
      end

      render json: config
    else
      render json: { errors: I18n.t('api.errors.algorithms.invalid_algorithm') }, status: :unprocessable_entity
    end
  end
end
