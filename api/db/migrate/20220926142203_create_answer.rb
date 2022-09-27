class CreateAnswer < ActiveRecord::Migration[7.0]
  def change
    create_table :answers do |t|
      t.belongs_to :node, null: false, foreign_key: true
      t.integer :reference
      t.hstore :label_translations
      t.integer :operator
      t.string :value
      t.boolean :unavailable, default: false

      t.timestamps
    end
  end
end
