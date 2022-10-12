class AddOldMedalcId < ActiveRecord::Migration[7.0]
  def change
    add_column :answers, :old_medalc_id, :integer
    add_column :nodes, :old_medalc_id, :integer
    add_column :users, :old_medalc_id, :integer
    add_column :instances, :old_medalc_id, :integer
  end
end
