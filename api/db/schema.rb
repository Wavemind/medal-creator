# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_10_12_093844) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "plpgsql"

  create_table "administration_routes", force: :cascade do |t|
    t.string "category"
    t.hstore "name_translations"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "algorithm_languages", force: :cascade do |t|
    t.bigint "language_id", null: false
    t.bigint "algorithm_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["algorithm_id"], name: "index_algorithm_languages_on_algorithm_id"
    t.index ["language_id"], name: "index_algorithm_languages_on_language_id"
  end

  create_table "algorithms", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.string "name"
    t.integer "minimum_age", default: 0
    t.integer "age_limit", default: 0
    t.hstore "age_limit_message_translations"
    t.hstore "description_translations"
    t.integer "mode"
    t.integer "status"
    t.json "full_order_json"
    t.json "medal_r_json"
    t.integer "medal_r_json_version", default: 0
    t.string "job_id", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_algorithms_on_project_id"
  end

  create_table "answer_types", force: :cascade do |t|
    t.string "value"
    t.string "display"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "answers", force: :cascade do |t|
    t.bigint "node_id", null: false
    t.integer "reference"
    t.hstore "label_translations"
    t.integer "operator"
    t.string "value"
    t.boolean "is_unavailable", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "old_medalc_id"
    t.index ["node_id"], name: "index_answers_on_node_id"
  end

  create_table "children", force: :cascade do |t|
    t.bigint "node_id", null: false
    t.bigint "instance_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instance_id"], name: "index_children_on_instance_id"
    t.index ["node_id"], name: "index_children_on_node_id"
  end

  create_table "conditions", force: :cascade do |t|
    t.bigint "instance_id", null: false
    t.bigint "answer_id", null: false
    t.integer "cut_off_start"
    t.integer "cut_off_end"
    t.integer "score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answer_id"], name: "index_conditions_on_answer_id"
    t.index ["instance_id"], name: "index_conditions_on_instance_id"
  end

  create_table "decision_trees", force: :cascade do |t|
    t.bigint "algorithm_id", null: false
    t.bigint "node_id", null: false
    t.integer "reference"
    t.hstore "label_translations"
    t.integer "cut_off_start"
    t.integer "cut_off_end"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["algorithm_id"], name: "index_decision_trees_on_algorithm_id"
    t.index ["node_id"], name: "index_decision_trees_on_node_id"
  end

  create_table "files", force: :cascade do |t|
    t.hstore "label_translations"
    t.string "url"
    t.string "fileable_type"
    t.bigint "fileable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fileable_type", "fileable_id"], name: "index_files_on_fileable"
  end

  create_table "formulations", force: :cascade do |t|
    t.bigint "node_id", null: false
    t.bigint "administration_route_id", null: false
    t.float "minimal_dose_per_kg"
    t.float "maximal_dose_per_kg"
    t.float "maximal_dose"
    t.integer "medication_form"
    t.decimal "dose_form"
    t.integer "liquid_concentration"
    t.integer "doses_per_day"
    t.decimal "unique_dose"
    t.integer "breakable"
    t.boolean "by_age", default: false
    t.hstore "description_translations"
    t.hstore "injection_instructions_translations"
    t.hstore "dispensing_description_translations"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["administration_route_id"], name: "index_formulations_on_administration_route_id"
    t.index ["node_id"], name: "index_formulations_on_node_id"
  end

  create_table "instances", force: :cascade do |t|
    t.bigint "node_id", null: false
    t.string "instanceable_type"
    t.bigint "instanceable_id"
    t.integer "position_x", default: 100
    t.integer "position_y", default: 100
    t.boolean "is_pre_referral", default: false
    t.hstore "duration_translations"
    t.hstore "description_translations"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "diagnosis_id"
    t.integer "old_medalc_id"
    t.index ["diagnosis_id"], name: "index_instances_on_diagnosis_id"
    t.index ["instanceable_type", "instanceable_id"], name: "index_instances_on_instanceable"
    t.index ["node_id"], name: "index_instances_on_node_id"
  end

  create_table "languages", force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "medal_data_config_variables", force: :cascade do |t|
    t.bigint "algorithm_id", null: false
    t.bigint "question_id"
    t.string "label"
    t.string "api_key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["algorithm_id"], name: "index_medal_data_config_variables_on_algorithm_id"
    t.index ["question_id"], name: "index_medal_data_config_variables_on_question_id"
  end

  create_table "node_complaint_categories", force: :cascade do |t|
    t.bigint "node_id"
    t.bigint "complaint_category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["complaint_category_id"], name: "index_node_complaint_categories_on_complaint_category_id"
    t.index ["node_id"], name: "index_node_complaint_categories_on_node_id"
  end

  create_table "node_exclusions", force: :cascade do |t|
    t.integer "node_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "excluding_node_id"
    t.bigint "excluded_node_id"
    t.index ["excluded_node_id"], name: "index_node_exclusions_on_excluded_node_id"
    t.index ["excluding_node_id"], name: "index_node_exclusions_on_excluding_node_id"
  end

  create_table "nodes", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.integer "reference"
    t.hstore "label_translations"
    t.string "type"
    t.hstore "description_translations"
    t.boolean "is_neonat", default: false
    t.boolean "is_danger_sign", default: false
    t.integer "stage"
    t.integer "system"
    t.integer "step"
    t.string "formula"
    t.integer "round"
    t.boolean "is_mandatory", default: false
    t.boolean "is_unavailable", default: false
    t.boolean "is_estimable", default: false
    t.boolean "is_identifiable", default: false
    t.boolean "is_referral", default: false
    t.boolean "is_pre_fill", default: false
    t.boolean "is_default", default: false
    t.integer "emergency_status", default: 0
    t.bigint "answer_type_id"
    t.string "reference_table_male_name"
    t.string "reference_table_female_name"
    t.float "min_value_warning"
    t.float "max_value_warning"
    t.float "min_value_error"
    t.float "max_value_error"
    t.hstore "min_message_error_translations"
    t.hstore "max_message_error_translations"
    t.hstore "min_message_warning_translations"
    t.hstore "max_message_warning_translations"
    t.hstore "placeholder_translations"
    t.integer "min_score", default: 0
    t.integer "cut_off_start"
    t.integer "cut_off_end"
    t.boolean "is_anti_malarial", default: false
    t.boolean "is_antibiotic", default: false
    t.integer "level_of_urgency", default: 5
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "reference_table_x_id"
    t.bigint "reference_table_y_id"
    t.bigint "reference_table_z_id"
    t.bigint "decision_tree_id"
    t.integer "old_medalc_id"
    t.index ["answer_type_id"], name: "index_nodes_on_answer_type_id"
    t.index ["decision_tree_id"], name: "index_nodes_on_decision_tree_id"
    t.index ["project_id"], name: "index_nodes_on_project_id"
    t.index ["reference_table_x_id"], name: "index_nodes_on_reference_table_x_id"
    t.index ["reference_table_y_id"], name: "index_nodes_on_reference_table_y_id"
    t.index ["reference_table_z_id"], name: "index_nodes_on_reference_table_z_id"
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "language_id", null: false
    t.string "name"
    t.boolean "consent_management", default: true
    t.boolean "track_referral", default: true
    t.string "description"
    t.hstore "study_description_translations"
    t.hstore "emergency_content_translations"
    t.bigint "emergency_content_version", default: 0
    t.json "medal_r_config"
    t.json "village_json"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["language_id"], name: "index_projects_on_language_id"
  end

  create_table "user_logs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "action"
    t.string "model_type"
    t.bigint "model_id"
    t.json "data"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_logs_on_user_id"
  end

  create_table "user_projects", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id", null: false
    t.boolean "is_admin", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_user_projects_on_project_id"
    t.index ["user_id"], name: "index_user_projects_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.integer "role"
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "webauthn_id"
    t.integer "old_medalc_id"
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.bigint "invited_by_id"
    t.integer "invitations_count", default: 0
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
    t.index ["webauthn_id"], name: "index_users_on_webauthn_id", unique: true
  end

  create_table "webauthn_credentials", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "external_id", null: false
    t.string "public_key", null: false
    t.string "name", null: false
    t.integer "sign_count", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "external_id", "user_id"], name: "index_webauthn_credentials_on_name_and_external_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_webauthn_credentials_on_user_id"
  end

  add_foreign_key "algorithm_languages", "algorithms"
  add_foreign_key "algorithm_languages", "languages"
  add_foreign_key "algorithms", "projects"
  add_foreign_key "answers", "nodes"
  add_foreign_key "children", "instances"
  add_foreign_key "children", "nodes"
  add_foreign_key "conditions", "answers"
  add_foreign_key "conditions", "instances"
  add_foreign_key "decision_trees", "algorithms"
  add_foreign_key "decision_trees", "nodes"
  add_foreign_key "formulations", "administration_routes"
  add_foreign_key "formulations", "nodes"
  add_foreign_key "instances", "nodes"
  add_foreign_key "medal_data_config_variables", "algorithms"
  add_foreign_key "node_exclusions", "nodes", column: "excluded_node_id"
  add_foreign_key "node_exclusions", "nodes", column: "excluding_node_id"
  add_foreign_key "nodes", "answer_types"
  add_foreign_key "nodes", "nodes", column: "reference_table_x_id"
  add_foreign_key "nodes", "nodes", column: "reference_table_y_id"
  add_foreign_key "nodes", "nodes", column: "reference_table_z_id"
  add_foreign_key "nodes", "projects"
  add_foreign_key "projects", "languages"
  add_foreign_key "user_logs", "users"
  add_foreign_key "user_projects", "projects"
  add_foreign_key "user_projects", "users"
  add_foreign_key "webauthn_credentials", "users"
end
