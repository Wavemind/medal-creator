require 'rails_helper'
require 'open-uri'

module Mutations
  module Variables
    describe DuplicateVariable, type: :graphql do
      describe '.resolve' do
        let(:context) { { current_api_v2_user: User.first } }
        let(:variable) { create(:variable) }

        it 'Duplicates a variable with its answers, files and complaint category conditions' do
          variable.reload # Reload the variable since it is created out of the 'it' block (and so is not considered by the database)

          # Create a node complaint category to ensure that it is duplicated aswell
          cc = variable.project.nodes.find_by(type: 'Variables::ComplaintCategory')
          NodeComplaintCategory.create!(node: variable, complaint_category: cc)

          url = 'https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/test.original.jpg'
          variable.files.attach(io: URI.open(url), filename: File.basename(url))

          expect do
            ApiSchema.execute(
              query,
              variables: { id: variable.id },
              context: { current_api_v2_user: User.first }
            )
          end.to change { Node.count }.by(1).and change { Answer.count }.by(2).and change {
                                                                                     NodeComplaintCategory.count
                                                                                   }.by(1).and change {
                                                                                                 ActiveStorage::Attachment.count
                                                                                               }.by(1)
        end

        it 'Ensures that duplicated label has "Copy of " before its label' do
          ApiSchema.execute(
            query,
            variables: { id: variable.id },
            context: { current_api_v2_user: User.first }
          )

          label_var = "label_#{variable.project.language.code}"
          expect(Node.last.send(label_var)).to eq("Copy of #{variable.send(label_var)}")
        end
      end

      def query
        <<~GQL
          mutation($id: ID!) {
            duplicateVariable(
              input: {
                id: $id
            }){
              id
            }
          }
        GQL
      end
    end
  end
end
