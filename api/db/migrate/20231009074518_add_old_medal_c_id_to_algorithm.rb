class AddOldMedalCIdToAlgorithm < ActiveRecord::Migration[7.0]
  def change
    add_column :algorithms, :old_medalc_id, :integer
    add_column :projects, :old_medalc_id, :integer
  end
end
