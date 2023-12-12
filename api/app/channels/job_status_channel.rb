class JobStatusChannel < ApplicationCable::Channel
  def subscribed
    @channel = "#{params[:job]}_#{params[:id]}"
    stream_for @channel
  end

  def current_job_info
    # Manu you can put your code in here
    # Set the status to 'transmitting' please
    puts "#################################################################"
    puts "IN HERE"
    puts @channel
    puts "#################################################################"
  end
end
