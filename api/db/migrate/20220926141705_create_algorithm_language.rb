class CreateAlgorithmLanguage < ActiveRecord::Migration[7.0]
  def change
    create_table :algorithm_languages do |t|
      t.belongs_to :language, null: false, foreign_key: true
      t.belongs_to :algorithm, null: false, foreign_key: true

      t.timestamps
    end
  end
end
