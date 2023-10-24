class GenerateAlgorithmJob < ApplicationJob
  queue_as :default

  def perform(algorithm)
    TestService.init(algorithm)
  end
end
