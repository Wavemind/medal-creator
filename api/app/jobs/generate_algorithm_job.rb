class GenerateAlgorithmJob < ApplicationJob
  queue_as :default

  def perform(id, mode)
    GenerateAlgorithmJsonService.generate(id, mode)
  end
end
