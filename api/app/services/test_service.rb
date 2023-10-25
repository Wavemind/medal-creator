# TODO : Remove this when the real service is ok
class TestService
  def self.init(algorithm)
    @algorithm = algorithm
    @project = algorithm.project
    @history = []
    @previous_message = ''

    begin
      run_function('Starting generation', 'starting')
      run_function('Function One') { sleep(rand(1..4)) }
      run_function('Function Two') { sleep(rand(1..4)) }
      run_function('Function Three') { sleep(rand(1..4)) }
      run_function('Function Four') { sleep(rand(1..4)) }
      run_function('Function Five') { sleep(rand(1..4)) }
      run_function('Function Six') { sleep(rand(1..4)) }
      run_function('Finishing generation', 'finished')
    rescue
      broadcast('Une erreur est survenue', 'error')
    end
  end

  private

  def self.run_function(name, status = 'transmitting')
    broadcast(name, status)
    starting = Time.now
    yield if block_given?
    ending = Time.now
    broadcast(name, status, ending - starting)
  end

  def self.broadcast(message, status, elapsed_time = 0)

    if @previous_message.present? && !elapsed_time.zero?
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

    JobStatusChannel.broadcast_to(
      @project,
      {
        message: message,
        status: status,
        element_id: @algorithm.id,
        history: @history
      }
    )
    @previous_message = message
  end
end
