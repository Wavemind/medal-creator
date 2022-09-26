class CreateNodeComplaintCategory < ActiveRecord::Migration[7.0]
  def change
    create_table :node_complaint_categories do |t|
      t.belongs_to :node
      t.belongs_to :complaint_category

      t.timestamps
    end
  end
end
