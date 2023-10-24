class CreateAlgorithm < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'hstore'
    create_table :algorithms do |t|
      t.belongs_to :project, null: false, foreign_key: true
      t.string :name
      t.integer :minimum_age, default: 0
      t.integer :age_limit, default: 0
      t.hstore :age_limit_message_translations, default: {}
      t.hstore :description_translations, default: {}
      t.integer :mode
      t.integer :status, default: 1
      t.json :full_order_json
      t.json :medal_r_json
      t.integer :medal_r_json_version, default: 0
      t.string :job_id, default: ''
      t.datetime :published_at
      t.datetime :json_generated_at
      t.datetime :archived_at

      t.timestamps
    end
  end
end
