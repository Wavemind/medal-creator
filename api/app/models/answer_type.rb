# Define how to display a question and how interpret their answers
class AnswerType < ApplicationRecord
  has_many :questions

  validates_presence_of :value, :display
end
