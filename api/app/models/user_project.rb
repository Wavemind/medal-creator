# Define users accesses to projects
class UserProject < ApplicationRecord

  belongs_to :user
  belongs_to :project

end
