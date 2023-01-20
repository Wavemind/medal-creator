module Types
  class HstoreType < Types::BaseObject
    Language.all.each do |language|
      field language.code, String
    end
  end
end

# <Algorithm id: nil, project_id: 1, name: "Alain", minimum_age: 0, age_limit: 1, age_limit_message_translations: {"en"=>"asdasd", "fr"=>""}, description_translations: {"en"=>"adsadasd", "fr"=>""}, mode: "intervention", status: nil, full_order_json: nil, medal_r_json: nil, medal_r_json_version: 0, job_id: "", created_at: nil, updated_at: nil>
# <Algorithm id: nil, project_id: 1, name: "ggfdgd", minimum_age: 0, age_limit: 1, age_limit_message_translations: {"en"=>"sddad", "fr"=>""}, description_translations: {"en"=>"ddsd", "fr"=>""}, mode: "intervention", status: nil, full_order_json: nil, medal_r_json: nil, medal_r_json_version: 0, job_id: "", created_at: nil, updated_at: nil>
