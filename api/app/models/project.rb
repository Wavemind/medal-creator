# Container of many versions of algorithms
class Project < ApplicationRecord
  has_many :user_projects
  has_many :users, through: :user_projects
  has_many :algorithms, dependent: :destroy
  has_many :nodes, dependent: :destroy
  has_many :drugs, -> { where type: 'HealthCares::Drug' }, class_name: 'Node'
  has_many :managements, -> { where type: 'HealthCares::Management' }, class_name: 'Node'
  has_many :diagnoses, -> { where(type: 'Diagnosis') }, class_name: 'Node'
  has_many :variables, -> { where(type: Variable.descendants.map(&:name)) }, class_name: 'Node'
  has_many :questions_sequences, -> { where(type: QuestionsSequence.descendants.map(&:name)) }, class_name: 'Node'

  belongs_to :language

  validates_presence_of :name
  validates_uniqueness_of :name

  accepts_nested_attributes_for :user_projects, reject_if: :all_blank, allow_destroy: true

  translates :emergency_content, :study_description

  def self.ransackable_attributes(auth_object = nil)
    ["name"]
  end
end
