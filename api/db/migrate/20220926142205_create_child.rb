class CreateChild < ActiveRecord::Migration[7.0]
  def change
    create_table :children do |t|
      t.references :node, null: false, foreign_key: true
      t.references :instance, null: false, foreign_key: true

      t.timestamps
    end
  end
end
