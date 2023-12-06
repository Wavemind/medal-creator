RSpec.describe GenerateAlgorithmJsonService, type: :service do
  let(:qs) { create(:questions_sequence) }
  let(:first_variable) { create(:variable) }
  let(:second_variable) { create(:variable) }
  let(:numeric_variable) { create(:integer_variable) }

  let(:empty_algorithm) { create(:algorithm) }

  it 'generates properly a JSON' do
    algorithm = Algorithm.first
    formula_variable = Project.first.nodes.create!(type: 'Variables::BackgroundCalculation', label_en: 'Formula',
                                                  answer_type_id: 5, formula: "[#{numeric_variable.id}]")

    qs.components.create(node: first_variable)
    qs.components.create(node: formula_variable)
    qs.components.first.conditions.create(answer: first_variable.answers.first)

    algorithm.components.create(node: qs)
    algorithm.components.create(node: second_variable)

    expect {
      GenerateAlgorithmJsonService.generate(algorithm.id)
      algorithm.reload
    }.not_to change(algorithm, :medal_r_json)

    qs.components.create(node: numeric_variable)
    expect {
      GenerateAlgorithmJsonService.generate(algorithm.id)
      algorithm.reload
    }.to change(algorithm, :medal_r_json)

    expect(algorithm.extract_used_nodes.map(&:id).sort).to eq(algorithm.medal_r_json['nodes'].keys.map(&:to_i).sort)

    generated_order = algorithm.medal_r_json['config']['full_order']

    generated_order.each do |step, content|
      expect(step).to be_in(Variable.steps)
      if %w(medical_history_step physical_exam_step).include?(step)
        content.each do |sub_content|
          expect(sub_content['data']).to be_an(Array)
          expect(sub_content['data']).to all(be_an(Integer))
        end
      elsif step == 'complaint_categories_step'
        content.values.each do |sub_content|
          expect(sub_content).to be_an(Array)
          expect(sub_content).to all(be_an(Integer))
        end
      else
        expect(content).to be_an(Array)
        if step == 'registration_step'
          expect(content).to include('first_name')
          expect(content).to include('last_name')
          expect(content).to include('birth_date')
          expect(content).to all(be_a(String).or(be_a(Integer)))
        else
          expect(content).to all(be_an(Integer))
        end
      end
    end
  end

  it 'generate properly a JSON even if the algorithm is empty' do
    GenerateAlgorithmJsonService.generate(empty_algorithm.id)
    empty_algorithm.reload
    expect(empty_algorithm.medal_r_json).not_to be_empty
  end
end
