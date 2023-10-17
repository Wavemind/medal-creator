class UploadFileService
  def self.upload_export(file, file_key)
    if Rails.env.prod?
      tempfile = Tempfile.new(file_key)
      file.serialize(tempfile.path)

      s3 = Aws::S3::Resource.new(
        access_key_id: ENV['AWS_ACCESS_KEY_ID'],
        secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
        region: ENV['AWS_REGION'],
        )

      bucket = s3.bucket(ENV['AWS_BUCKET'])
      obj = bucket.object(file_key)

      # Upload the file
      obj.upload_file(tempfile)
      obj.public_url
    else
      # Generate the file with a unique name
      file_path = Rails.root.join("public/#{file_key}")
      file.serialize(file_path)

      # Return the file name or path for future reference
      "#{Rails.application.routes.default_url_options[:host]}/#{file_key}"
    end
  end
end