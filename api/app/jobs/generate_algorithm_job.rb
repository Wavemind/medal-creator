class GenerateAlgorithmJob < ApplicationJob
  queue_as :default

  def perform
    begin
      100.times do |i|
        sleep(0.8)
        JobStatusChannel.broadcast_to(Algorithm.find(1), { status: i, code: 200})
      end
      raise
    rescue
      JobStatusChannel.broadcast_to(Algorithm.find(1), { status: 0, code: "Une erreur est survenue"})
    end
  end
end
