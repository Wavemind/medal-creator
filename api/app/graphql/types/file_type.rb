module Types
  class FileType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :url, String, null: false
    field :extension, String, null: false

    def name
      object.filename
    end

    def url
      Rails.application.routes.url_helpers.rails_blob_url(object)
    end

    def extension
      object.filename.extension_with_delimiter
    end
  end
end
