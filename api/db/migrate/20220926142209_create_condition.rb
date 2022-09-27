class CreateCondition < ActiveRecord::Migration[7.0]
  def change
    create_table :conditions do |t|
      t.belongs_to :instance, null: false, foreign_key: true
      t.belongs_to :answer, null: false, foreign_key: true
      t.integer :cut_off_start
      t.integer :cut_off_end
      t.integer :score

      t.timestamps
    end
  end
end
