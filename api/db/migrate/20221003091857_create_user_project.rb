class CreateUserProject < ActiveRecord::Migration[7.0]
  def change
    create_table :user_projects do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :project, null: false, foreign_key: true
      t.boolean :is_admin, default: false

      t.timestamps
    end
  end
end
