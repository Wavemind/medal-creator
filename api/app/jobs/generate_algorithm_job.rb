class GenerateAlgorithmJob < ApplicationJob
  queue_as :default

  def perform(id)
    GenerateAlgorithmJsonService.generate(id)
  end
end
