class CreateAnswerType < ActiveRecord::Migration[7.0]
  def change
    create_table :answer_types do |t|
      t.string :value
      t.string :display
      t.string :label_key

      t.timestamps
    end
  end
end
