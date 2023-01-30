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
end
