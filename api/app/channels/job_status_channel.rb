class JobStatusChannel < ApplicationCable::Channel
  def subscribed
    project = Project.find(params[:id])
    stream_for project
  end
end
