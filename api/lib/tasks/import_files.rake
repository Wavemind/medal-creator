namespace :import do
  desc "Import medias"
  task :medias, [:file_path] => :environment do |_, args|
    files = JSON.parse(File.read(args[:file_path]))
    processedFiles = 0
    files.each do |file|
      node = Node.find_by(old_medalc_id: file['record_id'])
      if node.present?
        url = file['url'].to_s
        node.files.attach(io: URI.open(url), filename: File.basename(url))
        processedFiles += 1
      end
      puts "#{processedFiles} / #{files.count}"
    end
  end
end
