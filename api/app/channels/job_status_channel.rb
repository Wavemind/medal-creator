class JobStatusChannel < ApplicationCable::Channel
  def subscribed
    stream_for "#{params[:job]}_#{params[:id]}"
  end
end
