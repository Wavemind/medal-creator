class CreateChild < ActiveRecord::Migration[7.0]
  def change
    create_table :children do |t|
      t.belongs_to :node, null: false, foreign_key: true
      t.belongs_to :instance, null: false, foreign_key: true

      t.timestamps
    end
  end
end
