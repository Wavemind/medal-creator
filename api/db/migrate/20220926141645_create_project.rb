class CreateProject < ActiveRecord::Migration[7.0]
  def change
    enable_extension "hstore"
    create_table :projects do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.boolean :consent_management, default: true
      t.boolean :track_referral, default: true
      t.hstore :description
      t.hstore :emergency_content_translations
      t.bigint :emergency_content_version, default: 0
      t.json :medal_r_config
      t.json :village_json

      t.timestamps
    end
  end
end
