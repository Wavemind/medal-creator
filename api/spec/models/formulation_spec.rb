RSpec.describe Variable, type: :model do
  it 'Returns translatable fields' do
    expect(Formulation.translatable_params).not_to include('label')
    expect(Formulation.translatable_params).to include('description')
    expect(Formulation.translatable_params).not_to include('placeholder')
    expect(Formulation.translatable_params).to include('injection_instructions')
    expect(Formulation.translatable_params).not_to include('duration')
  end
end
