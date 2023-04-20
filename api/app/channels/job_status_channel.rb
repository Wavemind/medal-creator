class JobStatusChannel < ApplicationCable::Channel
  def subscribed
    algorithm = Algorithm.find(params[:id])
    stream_for algorithm
  end
end
