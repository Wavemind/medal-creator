# TODO : Remove this when the real service is ok
class TestService
  def self.init(algorithm)
    @algorithm = algorithm
    @project = algorithm.project
    @history = []
    
    begin
      broadcast('Starting generation', 'starting')
      functionOne
      functionTwo
      functionThree
      functionFour
      functionFive
      functionSix
      broadcast('Finishing generation', 'finished')
    rescue
      broadcast('Une erreur est survenue', 'error')
    end
  end

  def self.functionOne
    starting = Time.now
    sleep(rand(1..4))
    ending = Time.now
    broadcast('Function one finished', 'transmitting', ending - starting)
  end
  
  def self.functionTwo
    starting = Time.now
    sleep(rand(1..4))
    ending = Time.now
    broadcast('Function two finished', 'transmitting', ending - starting)
  end
  
  def self.functionThree
    starting = Time.now
    sleep(rand(1..4))
    ending = Time.now
    broadcast('Function three finished', 'transmitting', ending - starting)
  end
  
  def self.functionFour
    starting = Time.now
    sleep(rand(1..4))
    ending = Time.now
    broadcast('Function four finished', 'transmitting', ending - starting)
  end
  
  def self.functionFive
    starting = Time.now
    sleep(rand(1..4))
    ending = Time.now
    broadcast('Function five finished', 'transmitting', ending - starting)
  end
  
  def self.functionSix
    starting = Time.now
    sleep(rand(1..4))
    ending = Time.now
    broadcast('Function six finished', 'transmitting', ending - starting)
  end

  def self.error
    raise
  end
  
  private 
  
  def self.broadcast(message, status, elapsed_time = 0)
    JobStatusChannel.broadcast_to(
      @project,
      { 
        message: message,
        status: status,
        element_id: @algorithm.id,
        history: @history.push({
          message: message,
          elapsed_time: elapsed_time
        }),
      }
    )
  end
end
