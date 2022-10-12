# Log user actions
class UserLog < ApplicationRecord

  belongs_to :user, optional: true

  # retrieve model from log attributes
  def model
    Object.const_get(model_type).find(model_id)
  end

  def log_create

  end

  def log_update

  end

  def log_delete

  end

end
