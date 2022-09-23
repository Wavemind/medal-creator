class CreateWebauthnCredentials < ActiveRecord::Migration[7.0]
  def change
    create_table :webauthn_credentials do |t|
      t.references :user, null: false, foreign_key: true
      t.string :external_id, null: false
      t.string :public_key, null: false
      t.string :name, null: false
      t.integer :sign_count, null: false

      t.timestamps
    end
    add_index :webauthn_credentials, %i[name external_id user_id], unique: true
  end
end
