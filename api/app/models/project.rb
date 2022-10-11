# Container of many versions of algorithms
class Project < ApplicationRecord
  has_many :user_projects
  has_many :users, through: :user_projects
  has_many :algorithms, dependent: :destroy
  has_many :nodes, dependent: :destroy

  belongs_to :user

  validates_presence_of :name
  validates_uniqueness_of :name

  translates :emergency_content

end
