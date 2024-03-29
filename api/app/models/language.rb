# Define every language the logic can be translated in
class Language < ApplicationRecord
  validates_presence_of :code, :name

  # @return [Array] attributes
  # Return attributes for hstore in each available language
  def self.language_params(field)
    Language.pluck(:code).unshift('en').map { |language| "#{field}_#{language}" }
  end
end
