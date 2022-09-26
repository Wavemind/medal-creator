class CreateNode < ActiveRecord::Migration[7.0]
  def change
    enable_extension "hstore"
    create_table :nodes do |t|
      t.references :project, null: false, foreign_key: true
      t.integer :reference
      t.hstore :label_translations
      t.string :type
      t.hstore :description_translations
      t.boolean :is_neonat, default: false
      t.boolean :is_danger_sign, default: false

      # Specific fields for Questions
      t.integer :stage
      t.integer :system
      t.integer :step
      t.string :formula
      t.integer :round
      t.boolean :is_mandatory, default: false
      t.boolean :is_unavailable, default: false
      t.boolean :is_estimable, default: false
      t.boolean :is_identifiable, default: false
      t.boolean :is_referral, default: false
      t.boolean :is_pre_fill, default: false
      t.boolean :is_default, default: false
      t.integer :emergency_status, default: 0
      t.references :answer_type, foreign_key: true
      t.string :reference_table_male_name
      t.string :reference_table_female_name
      t.float :min_value_warning
      t.float :max_value_warning
      t.float :min_value_error
      t.float :max_value_error
      t.hstore :min_message_error_translations
      t.hstore :max_message_error_translations
      t.hstore :min_message_warning_translations
      t.hstore :max_message_warning_translations
      t.hstore :placeholder_translations

      # Specific fields for QuestionSequences
      t.integer :min_score, default: 0
      t.integer :cut_off_start
      t.integer :cut_off_end

      # Specific fields for Drugs
      t.boolean :is_anti_malarial, default: false
      t.boolean :is_antibiotic, default: false
      t.integer :level_of_urgency, default: 5 # Also Managements and Diagnoses


      t.timestamps
    end

    add_reference :nodes, :reference_table_x, index: true
    add_foreign_key :nodes, :nodes, column: :reference_table_x_id

    add_reference :nodes, :reference_table_y, index: true
    add_foreign_key :nodes, :nodes, column: :reference_table_y_id

    add_reference :nodes, :reference_table_z, index: true
    add_foreign_key :nodes, :nodes, column: :reference_table_z_id
  end
end
