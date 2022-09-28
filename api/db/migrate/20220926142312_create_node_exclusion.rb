class CreateNodeExclusion < ActiveRecord::Migration[7.0]
  def change
    create_table :node_exclusions do |t|
      t.integer :node_type

      t.timestamps
    end

    add_reference :node_exclusions, :excluding_node, index: true
    add_foreign_key :node_exclusions, :nodes, column: :excluding_node_id

    add_reference :node_exclusions, :excluded_node, index: true
    add_foreign_key :node_exclusions, :nodes, column: :excluded_node_id
  end
end
