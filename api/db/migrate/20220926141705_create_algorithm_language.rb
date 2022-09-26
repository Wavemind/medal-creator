class CreateAlgorithmLanguage < ActiveRecord::Migration[7.0]
  def change
    create_table :algorithm_languages do |t|
      t.references :language, null: false, foreign_key: true
      t.references :algorithm, null: false, foreign_key: true

      t.timestamps
    end
  end
end
