RSpec.describe GenerateAlgorithmJsonService, type: :service do
  it 'generates properly a JSON', focus: true do
    algorithm = Algorithm.first
    GenerateAlgorithmJsonService.generate(algorithm.id)
    algorithm.reload
    json = algorithm.medal_r_json
    puts '*********'
    puts json['nodes'].count
    puts '*********'
    puts json['health_cares'].count
    puts '*********'
    puts algorithm.project.variables.count
    puts '*********'
  end
end
