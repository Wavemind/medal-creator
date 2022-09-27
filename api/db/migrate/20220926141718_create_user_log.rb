class CreateUserLog < ActiveRecord::Migration[7.0]
  def change
    create_table :user_logs do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :action
      t.string :model_type
      t.bigint :model_id
      t.json :data
      t.string :ip_address

      t.timestamps
    end
  end
end
