RSpec.describe Variable, type: :model do
  it 'Returns translatable fields' do
    expect(Node.translatable_params).to include('label')
    expect(Node.translatable_params).to include('description')
    expect(Node.translatable_params).not_to include('placeholder')
    expect(Node.translatable_params).not_to include('injection_instructions')
    expect(Node.translatable_params).not_to include('duration')
  end
end
