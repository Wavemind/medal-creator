class CreateFormulation < ActiveRecord::Migration[7.0]
  def change
    create_table :formulations do |t|
      t.belongs_to :node, null: false, foreign_key: true
      t.belongs_to :administration_route, null: false, foreign_key: true
      t.float :minimal_dose_per_kg
      t.float :maximal_dose_per_kg
      t.float :maximal_dose
      t.integer :medication_form
      t.decimal :dose_form
      t.integer :liquid_concentration
      t.integer :doses_per_day
      t.decimal :unique_dose
      t.integer :breakable
      t.boolean :by_age, default: false
      t.hstore :description_translations
      t.hstore :injection_instructions_translations
      t.hstore :dispensing_description_translations

      t.timestamps
    end
  end
end
