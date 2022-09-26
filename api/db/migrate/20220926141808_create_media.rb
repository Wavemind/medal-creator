class CreateMedia < ActiveRecord::Migration[7.0]
  def change
    enable_extension "hstore"
    create_table :media do |t|
      t.hstore :label_translations
      t.string :url
      t.references :fileable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
