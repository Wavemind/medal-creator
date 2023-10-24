class CreateInstance < ActiveRecord::Migration[7.0]
  def change
    create_table :instances do |t|
      t.belongs_to :node, null: false, foreign_key: true
      t.belongs_to :instanceable, polymorphic: true, index: true
      t.float :position_x
      t.float :position_y, default: 100
      t.boolean :is_pre_referral, default: false
      t.hstore :duration_translations, default: {}
      t.hstore :description_translations, default: {}

      t.timestamps
    end
    add_reference :instances, :diagnosis, column: :diagnosis_id
  end
end
