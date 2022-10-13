# Define every languages for one algorithm
class AlgorithmLanguage < ApplicationRecord

  belongs_to :algorithm
  belongs_to :language

end
