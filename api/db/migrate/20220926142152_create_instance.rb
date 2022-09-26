class CreateInstance < ActiveRecord::Migration[7.0]
  def change
    create_table :instances do |t|
      t.references :node, null: false, foreign_key: true
      t.references :instanceable, polymorphic: true, index: true
      t.integer :position_x, default: 100
      t.integer :position_y, default: 100
      t.boolean :is_pre_referral, default: false
      t.hstore :duration_translations
      t.hstore :description_translations

      t.timestamps
    end
    add_reference :instances, :diagnosis, column: :diagnosis_id
  end
end
