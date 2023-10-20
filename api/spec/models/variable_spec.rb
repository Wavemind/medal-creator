RSpec.describe Variable, type: :model do
  it 'Returns translatable fields' do
    expect(Variable.translatable_params).to include('label')
    expect(Variable.translatable_params).to include('description')
    expect(Variable.translatable_params).to include('placeholder')
    expect(Variable.translatable_params).not_to include('injection_instructions')
    expect(Variable.translatable_params).not_to include('duration')
  end
end
