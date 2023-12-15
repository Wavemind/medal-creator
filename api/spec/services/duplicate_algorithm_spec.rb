RSpec.describe DuplicateAlgorithmService, type: :service do
  it 'duplicates algorithm properly', focus: true do
    algorithm = Algorithm.first
    expect {
      DuplicateAlgorithmService.process(algorithm.id)
    }.to change { DecisionTree.count }.by(algorithm.decision_trees.count)
                                      .and change { Node.count }.by(algorithm.decision_trees.map(&:diagnoses).flatten.count)
                                      .and change { MedalDataConfigVariable.count }.by(algorithm.medal_data_config_variables.count)
                                      .and change { Instance.count }.by(algorithm.components.count + algorithm.decision_trees.map(&:components).flatten.count)

    duplicated_algorithm = Algorithm.last

    expect(duplicated_algorithm.name).to eq("Copy of #{algorithm.name}")
  end
end
