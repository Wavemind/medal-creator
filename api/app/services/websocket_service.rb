class WebsocketService
  def self.init
    @history = []
    @previous_message = ''
  end

  # Websocket function
  def self.run_function(name, status = 'transmitting')
    broadcast(name, status)
    starting = Time.now
    yield if block_given?
    ending = Time.now
    broadcast(name, status, status == 'transmitting' ? ending - starting : 0)
  end

  def self.broadcast(message, status, elapsed_time = nil)
    if @previous_message.present? && elapsed_time
      message_entry = {
        message: @previous_message,
        elapsed_time: elapsed_time
      }

      index = @history.index { |entry| entry[:message] == message_entry[:message] }

      if index
        @history[index] = message_entry
      else
        @history.push(message_entry)
      end
    end

    file_path = Rails.root.join("tmp/history_#{@channel_name}.json")

    # Open the file in append mode (or create it if it doesn't exist)
    File.open(file_path, 'wb') do |file|
      json = { message: message, element_id: @algorithm.id, history: @history }
      file.write(JSON.generate(json))
    end

    JobStatusChannel.broadcast_to(
      @channel_name,
      {
        message: message,
        status: status,
        element_id: @algorithm.id,
        history: @history
      }
    )
    @previous_message = message
  end

  def self.remove_history_file
    file_path = Rails.root.join("tmp/history_#{@channel_name}.json")
    File.delete(file_path) if File.exist?(file_path)
  end
end
