# Container of many versions of algorithms
class Project < ApplicationRecord
  has_many :user_projects
  has_many :users, through: :user_projects
  has_many :versions, dependent: :destroy
  has_many :nodes, dependent: :destroy
  has_many :diagnoses, -> { where type: 'FinalDiagnosis' }, source: :node
  has_many :questions, -> { where type: Question.descendants.map(&:name) }, source: :node
  has_many :questions_sequences, -> { where type: QuestionsSequence.descendants.map(&:name) }, source: :node
  has_many :health_cares, -> { where type: HealthCare.descendants.map(&:name) }, source: :node

  belongs_to :user

  validates_presence_of :name
  validates_uniqueness_of :name

  translates :emergency_content

end
