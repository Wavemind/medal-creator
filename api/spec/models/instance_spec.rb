RSpec.describe Variable, type: :model do
  it 'Returns translatable fields' do
    expect(Instance.translatable_params).not_to include('label')
    expect(Instance.translatable_params).to include('description')
    expect(Instance.translatable_params).not_to include('placeholder')
    expect(Instance.translatable_params).not_to include('injection_instructions')
    expect(Instance.translatable_params).to include('duration')
  end
end
