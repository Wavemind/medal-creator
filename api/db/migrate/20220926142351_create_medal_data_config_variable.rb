class CreateMedalDataConfigVariable < ActiveRecord::Migration[7.0]
  def change
    create_table :medal_data_config_variables do |t|
      t.belongs_to :algorithm, null: false, foreign_key: true
      t.belongs_to :variable
      t.string :label
      t.string :api_key

      t.timestamps
    end
  end
end
