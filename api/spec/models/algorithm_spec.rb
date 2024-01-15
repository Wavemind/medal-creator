RSpec.describe Algorithm, type: :model do
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

  it 'does not allow to update readonly content when algorithm is in prod status' do
    algorithm = Algorithm.first
    decision_tree = algorithm.decision_trees.first
    variable = decision_tree.components.variables.first.node
    drug = decision_tree.components.drugs.first.node
    management = decision_tree.components.managements.first.node

    variable.update(is_neonat: true)
    drug.update(is_neonat: true)
    management.update(is_neonat: true)

    algorithm.update(status: 'prod')

    # Should add one error to each because is_neonat is readonly when deployed
    expect {
      variable.update(is_neonat: false)
      drug.update(is_neonat: false)
      management.update(is_neonat: false)
    }.to change { variable.errors.count}.by(1).and change { drug.errors.count }.by(1).and change { management.errors.count }.by(1)

    # Should have readonly error text on neonat field
    expect(variable.errors.messages[:is_neonat][0]).to eq(I18n.t('activerecord.errors.nodes.readonly', field: :is_neonat))
    expect(drug.errors.messages[:is_neonat][0]).to eq(I18n.t('activerecord.errors.nodes.readonly', field: :is_neonat))
    expect(management.errors.messages[:is_neonat][0]).to eq(I18n.t('activerecord.errors.nodes.readonly', field: :is_neonat))

    # Should remove any error from variable drug and management
    expect {
      algorithm.update(status: 'draft')

      variable.update(is_neonat: true)
      drug.update(is_neonat: true)
      management.update(is_neonat: true)
    }.to change { variable.errors.count }.by(-1).and change { drug.errors.count }.by(-1).and change { management.errors.count }.by(-1)
  end
end
