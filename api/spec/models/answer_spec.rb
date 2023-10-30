RSpec.describe Variable, type: :model do
  it 'Returns translatable fields' do
    expect(Answer.translatable_params).to include('label')
    expect(Answer.translatable_params).not_to include('description')
    expect(Answer.translatable_params).not_to include('placeholder')
    expect(Answer.translatable_params).not_to include('injection_instructions')
    expect(Answer.translatable_params).not_to include('duration')
  end
end
