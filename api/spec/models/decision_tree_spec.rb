RSpec.describe DecisionTree, type: :model do
  it 'updates the updated_at field when a condition or an instance is touched in its diagram' do
    dt = DecisionTree.first
    start_date = dt.updated_at
    i = dt.components.create!(node: Node.first)
    second_time = dt.updated_at
    expect(start_date < second_time).to eq(true)
    i.conditions.create!(answer: dt.components.second.node.answers.first)
    expect(start_date < dt.updated_at).to eq(true)
  end

  it 'does not update the updated_at field if only position of instance is updated' do
    dt = DecisionTree.first
    start_date = dt.updated_at
    dt.components.first.update(position_y: 1500)
    expect(start_date < dt.updated_at).to eq(false)
  end

  it 'Returns translatable fields' do
    expect(DecisionTree.translatable_params).to include('label')
    expect(DecisionTree.translatable_params).not_to include('description')
    expect(DecisionTree.translatable_params).not_to include('placeholder')
    expect(DecisionTree.translatable_params).not_to include('injection_instructions')
    expect(DecisionTree.translatable_params).not_to include('duration')
  end
end
