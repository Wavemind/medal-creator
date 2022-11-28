module Types
  class ProjectSummaryType < Types::BaseObject
    field :algorithms_count, Integer
    field :questions_count, Integer
    field :drugs_count, Integer
    field :managements_count, Integer
    field :questions_sequences_count, Integer

    def algorithms_count
      object.algorithms.size
    end

    def questions_count
      object.questions.size
    end

    def drugs_count
      object.drugs.size
    end

    def managements_count
      object.managements.size
    end

    def questions_sequences_count
      object.questions_sequences.size
    end
  end
end
