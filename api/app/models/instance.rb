# Define the instance of a node in a diagnosis
class Instance < ApplicationRecord
  belongs_to :node
  belongs_to :instanceable, polymorphic: true
  belongs_to :diagnosis, optional: true

  has_many :children
  has_many :nodes, through: :children # TODO : check if necessary
  has_many :conditions, dependent: :destroy

  scope :managements, -> { joins(:node).includes(:conditions).where('nodes.type = ?', 'HealthCares::Management') }
  scope :questions, lambda {
                      joins(:node).includes(:conditions).where('nodes.type IN (?)', Question.descendants.map(&:name))
                    }
  scope :questions_sequences, lambda {
                                joins(:node).includes(:conditions).where('nodes.type IN (?)', QuestionsSequence.descendants.map(&:name))
                              }
  scope :drugs, -> { joins(:node).includes(:conditions).where('nodes.type = ?', 'HealthCares::Drug') }
  scope :diagnoses, -> { joins(:node).includes(:conditions).where('nodes.type = ?', 'Diagnosis') }

  scope :triage_complaint_category, lambda {
                                      joins(:node).where('nodes.stage = ? AND nodes.type = ?', Question.stages[:triage], 'Questions::ComplaintCategory')
                                    }
  scope :triage_under_complaint_category, lambda {
                                            joins(:node).where('nodes.type NOT IN (?)', %w[Questions::UniqueTriageQuestion Questions::ComplaintCategory])
                                          }

  # Allow to filter if the node is used as a health care condition or as a final diagnosis condition. A node can be used in both of them.
  scope :diagnosis_conditions, -> { includes(:conditions).where(diagnosis_id: nil) }
  scope :health_care_conditions, -> { includes(:conditions).where.not(diagnosis_id: nil) }

  translates :duration, :description
end
