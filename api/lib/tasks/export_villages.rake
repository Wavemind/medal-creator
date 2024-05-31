namespace :export do
  desc "Export villages"
  task :villages, [:file_path] => :environment do |_, args|
    Project.find_each do |project|
      file_name = Rails.root.join('public', "#{project.name.parameterize}.json")
      File.open(file_name, 'w') do |file|
        file.write(project.village_json)
      end
      puts "Created #{file_name}"
    end
  end
end
