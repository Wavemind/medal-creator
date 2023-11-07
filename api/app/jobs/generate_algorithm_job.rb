class GenerateAlgorithmJob < ApplicationJob
  queue_as :default

  def perform(id)
    puts '##########################################'
    puts 'HEEEEEEEEE'
    puts '##########################################'
    GenerateAlgorithmJsonService.init(id)
  end
end
