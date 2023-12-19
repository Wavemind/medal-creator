class DuplicateAlgorithmJob < ApplicationJob
  queue_as :default

  def perform(id)
    DuplicateAlgorithmService.process(id)
  end
end
