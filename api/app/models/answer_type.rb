# Define how to display a variable and how interpret their answers
class AnswerType < ApplicationRecord

  has_many :variables

  validates_presence_of :value, :display
end
