class JobStatusChannel < ApplicationCable::Channel
  def subscribed
    @channel = "#{params[:job]}_#{params[:id]}"
    stream_for @channel
  end

  def current_job_info
    file_path = Rails.root.join("tmp/history_#{@channel}.json")

    if File.exist?(file_path)
      content = File.read(file_path)
      json = JSON.parse(content)

      JobStatusChannel.broadcast_to(
        @channel,
        {
          message: json["message"],
          status: 'transmitting',
          element_id: json["element_id"],
          history: json["history"]
        }
      )
    end
  end
end
