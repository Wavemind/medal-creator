RSpec.describe GenerateAlgorithmJsonService, type: :service do
  it 'generates properly a JSON' do
    algorithm = Algorithm.first
    GenerateAlgorithmJsonService.generate(algorithm.id)
    algorithm.reload
    json = algorithm.medal_r_json
  end
end
