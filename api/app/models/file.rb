# Can be gif or images and stock in server with carrierwave
class File < ApplicationRecord
  # TODO: FIX IT
  # include CopyCarrierwaveFile
  # mount_uploader :url, MediaUploader

  belongs_to :fileable, polymorphic: true

  validates_presence_of :label_translations, :url

  translates :label
end
