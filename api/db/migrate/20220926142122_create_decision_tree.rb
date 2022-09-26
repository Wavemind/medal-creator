class CreateDecisionTree < ActiveRecord::Migration[7.0]
  def change
    create_table :decision_trees do |t|
      t.references :algorithm, null: false, foreign_key: true
      t.references :node, null: false, foreign_key: true
      t.integer :reference
      t.hstore :label_translations
      t.integer :cut_off_start
      t.integer :cut_off_end

      t.timestamps
    end

    add_reference :nodes, :decision_tree
  end
end
