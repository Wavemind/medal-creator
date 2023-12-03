namespace :import do
  desc "Import medias"
  task medias: :environment do
    files = JSON.parse(File.read(Rails.root.join('db/old_medias.json')))
    files.each do |file|
      node = Node.find_by(old_medalc_id: file['record_id'])
      if node.present?
        url = file['url'].to_s
        node.files.attach(io: URI.open(url), filename: File.basename(url))
      end
    end
  end
end
