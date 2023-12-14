class JobStatusChannel < ApplicationCable::Channel
  def subscribed
    @channel = "#{params[:job]}_#{params[:id]}"
    stream_for @channel
  end

  def current_job_info
    # Manu you can put your code in here
    # Set the status to 'transmitting' please

    file_path = Rails.root.join("tmp/history_#{@channel}.txt")

    if File.exist?(file_path)
      content = File.read(file_path)

      JobStatusChannel.broadcast_to(
        "duplication_#{@project.id}",
        {
          message: '',
          status: 'transmitting',
          element_id: params[:id],
          history: content.split('\n')
        }
      )
    end
  end
end
