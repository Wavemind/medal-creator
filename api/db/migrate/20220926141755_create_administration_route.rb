class CreateAdministrationRoute < ActiveRecord::Migration[7.0]
  def change
    enable_extension "hstore"
    create_table :administration_routes do |t|
      t.string :category
      t.hstore :name_translations

      t.timestamps
    end
  end
end
