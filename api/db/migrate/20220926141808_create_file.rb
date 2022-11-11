class CreateFile < ActiveRecord::Migration[7.0]
  def change
    enable_extension "hstore"
    create_table :files do |t|
      t.hstore :label_translations, default: {}
      t.string :url
      t.belongs_to :fileable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
