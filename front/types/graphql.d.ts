export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any
  /** Represents untyped JSON */
  JSON: any
  Upload: any
}

/** Autogenerated input type of AcceptInvitation */
export type AcceptInvitationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: UserInput
}

/** Autogenerated return type of AcceptInvitation */
export type AcceptInvitationPayload = {
  __typename?: 'AcceptInvitationPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  user?: Maybe<User>
}

export type AdministrationRoute = {
  __typename?: 'AdministrationRoute'
  category?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  nameTranslations?: Maybe<Hstore>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type Algorithm = {
  __typename?: 'Algorithm'
  ageLimit?: Maybe<Scalars['Int']>
  ageLimitMessageTranslations?: Maybe<Hstore>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  decisionTrees?: Maybe<Array<DecisionTree>>
  descriptionTranslations?: Maybe<Hstore>
  fullOrderJson?: Maybe<Scalars['JSON']>
  id: Scalars['ID']
  jobId?: Maybe<Scalars['String']>
  languages?: Maybe<Array<Language>>
  medalDataConfigVariables?: Maybe<Array<MedalDataConfigVariable>>
  medalRJson?: Maybe<Scalars['JSON']>
  medalRJsonVersion?: Maybe<Scalars['Int']>
  minimumAge?: Maybe<Scalars['Int']>
  mode?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** The connection type for Algorithm. */
export type AlgorithmConnection = {
  __typename?: 'AlgorithmConnection'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AlgorithmEdge>>>
  id: Scalars['ID']
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Algorithm>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  totalCount: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** An edge in a connection. */
export type AlgorithmEdge = {
  __typename?: 'AlgorithmEdge'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  id: Scalars['ID']
  /** The item at the end of the edge. */
  node?: Maybe<Algorithm>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type AlgorithmInput = {
  ageLimit?: InputMaybe<Scalars['Int']>
  ageLimitMessageTranslations?: InputMaybe<HstoreInput>
  descriptionTranslations?: InputMaybe<HstoreInput>
  fullOrderJson?: InputMaybe<Scalars['JSON']>
  id?: InputMaybe<Scalars['ID']>
  jobId?: InputMaybe<Scalars['String']>
  languageIds?: InputMaybe<Array<Scalars['ID']>>
  medalRJson?: InputMaybe<Scalars['JSON']>
  medalRJsonVersion?: InputMaybe<Scalars['Int']>
  minimumAge?: InputMaybe<Scalars['Int']>
  mode?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  projectId?: InputMaybe<Scalars['ID']>
  status?: InputMaybe<Scalars['String']>
}

export type Answer = {
  __typename?: 'Answer'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  isUnavailable?: Maybe<Scalars['Boolean']>
  labelTranslations?: Maybe<Hstore>
  operator?: Maybe<Scalars['String']>
  reference?: Maybe<Scalars['Int']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  value?: Maybe<Scalars['String']>
}

export type AnswerType = {
  __typename?: 'AnswerType'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  display?: Maybe<Scalars['String']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  value?: Maybe<Scalars['String']>
}

export type Condition = {
  __typename?: 'Condition'
  answer?: Maybe<Answer>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  cutOffEnd?: Maybe<Scalars['Int']>
  cutOffStart?: Maybe<Scalars['Int']>
  id: Scalars['ID']
  instance?: Maybe<Instance>
  score?: Maybe<Scalars['Int']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of CreateAlgorithm */
export type CreateAlgorithmInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: AlgorithmInput
}

/** Autogenerated return type of CreateAlgorithm */
export type CreateAlgorithmPayload = {
  __typename?: 'CreateAlgorithmPayload'
  algorithm?: Maybe<Algorithm>
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of CreateDecisionTree */
export type CreateDecisionTreeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: DecisionTreeInput
}

/** Autogenerated return type of CreateDecisionTree */
export type CreateDecisionTreePayload = {
  __typename?: 'CreateDecisionTreePayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  decisionTree?: Maybe<DecisionTree>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of CreateDiagnosis */
export type CreateDiagnosisInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  files?: InputMaybe<Array<Scalars['Upload']>>
  id?: InputMaybe<Scalars['ID']>
  params: DiagnosisInput
}

/** Autogenerated return type of CreateDiagnosis */
export type CreateDiagnosisPayload = {
  __typename?: 'CreateDiagnosisPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  diagnosis?: Maybe<Diagnosis>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of CreateProject */
export type CreateProjectInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: ProjectInput
  villages?: InputMaybe<Scalars['Upload']>
}

/** Autogenerated return type of CreateProject */
export type CreateProjectPayload = {
  __typename?: 'CreateProjectPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  project?: Maybe<Project>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of CreateUser */
export type CreateUserInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: UserInput
}

/** Autogenerated return type of CreateUser */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  user?: Maybe<User>
}

export type DecisionTree = {
  __typename?: 'DecisionTree'
  algorithm?: Maybe<Algorithm>
  components?: Maybe<Array<Instance>>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  cutOffEnd?: Maybe<Scalars['Int']>
  cutOffStart?: Maybe<Scalars['Int']>
  cutOffValueType?: Maybe<Scalars['String']>
  diagnoses?: Maybe<Array<Diagnosis>>
  id: Scalars['ID']
  labelTranslations?: Maybe<Hstore>
  node?: Maybe<Variable>
  reference?: Maybe<Scalars['Int']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** The connection type for DecisionTree. */
export type DecisionTreeConnection = {
  __typename?: 'DecisionTreeConnection'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<DecisionTreeEdge>>>
  id: Scalars['ID']
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<DecisionTree>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  totalCount: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** An edge in a connection. */
export type DecisionTreeEdge = {
  __typename?: 'DecisionTreeEdge'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  id: Scalars['ID']
  /** The item at the end of the edge. */
  node?: Maybe<DecisionTree>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type DecisionTreeInput = {
  algorithmId?: InputMaybe<Scalars['ID']>
  cutOffEnd?: InputMaybe<Scalars['Int']>
  cutOffStart?: InputMaybe<Scalars['Int']>
  cutOffValueType?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  labelTranslations?: InputMaybe<HstoreInput>
  nodeId?: InputMaybe<Scalars['ID']>
}

/** Autogenerated input type of DestroyAlgorithm */
export type DestroyAlgorithmInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id: Scalars['ID']
}

/** Autogenerated return type of DestroyAlgorithm */
export type DestroyAlgorithmPayload = {
  __typename?: 'DestroyAlgorithmPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id?: Maybe<Scalars['ID']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of DestroyDecisionTree */
export type DestroyDecisionTreeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id: Scalars['ID']
}

/** Autogenerated return type of DestroyDecisionTree */
export type DestroyDecisionTreePayload = {
  __typename?: 'DestroyDecisionTreePayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id?: Maybe<Scalars['ID']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of DestroyDiagnosis */
export type DestroyDiagnosisInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id: Scalars['ID']
}

/** Autogenerated return type of DestroyDiagnosis */
export type DestroyDiagnosisPayload = {
  __typename?: 'DestroyDiagnosisPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id?: Maybe<Scalars['ID']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type Diagnosis = {
  __typename?: 'Diagnosis'
  components?: Maybe<Array<Instance>>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  descriptionTranslations?: Maybe<Hstore>
  files: Array<File>
  id: Scalars['ID']
  instances?: Maybe<Array<Instance>>
  isDangerSign?: Maybe<Scalars['Boolean']>
  isNeonat?: Maybe<Scalars['Boolean']>
  labelTranslations?: Maybe<Hstore>
  levelOfUrgency?: Maybe<Scalars['Int']>
  reference?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** The connection type for Diagnosis. */
export type DiagnosisConnection = {
  __typename?: 'DiagnosisConnection'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<DiagnosisEdge>>>
  id: Scalars['ID']
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Diagnosis>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  totalCount: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** An edge in a connection. */
export type DiagnosisEdge = {
  __typename?: 'DiagnosisEdge'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  id: Scalars['ID']
  /** The item at the end of the edge. */
  node?: Maybe<Diagnosis>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type DiagnosisInput = {
  decisionTreeId?: InputMaybe<Scalars['ID']>
  descriptionTranslations?: InputMaybe<HstoreInput>
  id?: InputMaybe<Scalars['ID']>
  isDangerSign?: InputMaybe<Scalars['Boolean']>
  isNeonat?: InputMaybe<Scalars['Boolean']>
  labelTranslations?: InputMaybe<HstoreInput>
  levelOfUrgency?: InputMaybe<Scalars['Int']>
  reference?: InputMaybe<Scalars['Int']>
}

/** Autogenerated input type of Disable2fa */
export type Disable2faInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: TwoFaInput
}

/** Autogenerated return type of Disable2fa */
export type Disable2faPayload = {
  __typename?: 'Disable2faPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id?: Maybe<Scalars['ID']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type Drug = {
  __typename?: 'Drug'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  descriptionTranslations?: Maybe<Hstore>
  files: Array<File>
  formulations?: Maybe<Array<Formulation>>
  id: Scalars['ID']
  instances?: Maybe<Array<Instance>>
  isAntiMalarial?: Maybe<Scalars['Boolean']>
  isAntibiotic?: Maybe<Scalars['Boolean']>
  isDangerSign?: Maybe<Scalars['Boolean']>
  isNeonat?: Maybe<Scalars['Boolean']>
  labelTranslations?: Maybe<Hstore>
  levelOfUrgency?: Maybe<Scalars['Int']>
  reference?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of DuplicateDecisionTree */
export type DuplicateDecisionTreeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id: Scalars['ID']
}

/** Autogenerated return type of DuplicateDecisionTree */
export type DuplicateDecisionTreePayload = {
  __typename?: 'DuplicateDecisionTreePayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id?: Maybe<Scalars['ID']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of Enable2fa */
export type Enable2faInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: TwoFaInput
}

/** Autogenerated return type of Enable2fa */
export type Enable2faPayload = {
  __typename?: 'Enable2faPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id?: Maybe<Scalars['ID']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type File = {
  __typename?: 'File'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  extension: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
  size: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  url: Scalars['String']
}

export type Formulation = {
  __typename?: 'Formulation'
  administrationRoute?: Maybe<AdministrationRoute>
  breakable?: Maybe<Scalars['String']>
  byAge?: Maybe<Scalars['Boolean']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  descriptionTranslations?: Maybe<Hstore>
  dispensingDescriptionTranslations?: Maybe<Hstore>
  doseForm?: Maybe<Scalars['Float']>
  dosesPerDay?: Maybe<Scalars['Int']>
  id: Scalars['ID']
  injectionInstructionsTranslations?: Maybe<Hstore>
  liquidConcentration?: Maybe<Scalars['Int']>
  maximalDose?: Maybe<Scalars['Float']>
  maximalDosePerKg?: Maybe<Scalars['Float']>
  medicationForm?: Maybe<Scalars['String']>
  minimalDosePerKg?: Maybe<Scalars['Float']>
  uniqueDose?: Maybe<Scalars['Float']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type Hstore = {
  __typename?: 'Hstore'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  en?: Maybe<Scalars['String']>
  fr?: Maybe<Scalars['String']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type HstoreInput = {
  en?: InputMaybe<Scalars['String']>
  fr?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
}

export type Instance = {
  __typename?: 'Instance'
  conditions?: Maybe<Array<Condition>>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  descriptionTranslations?: Maybe<Hstore>
  durationTranslations?: Maybe<Hstore>
  id: Scalars['ID']
  instanceableId?: Maybe<Scalars['Int']>
  instanceableType?: Maybe<Scalars['String']>
  isPreReferral?: Maybe<Scalars['Boolean']>
  positionX?: Maybe<Scalars['Int']>
  positionY?: Maybe<Scalars['Int']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type Language = {
  __typename?: 'Language'
  code?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of LockUser */
export type LockUserInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id: Scalars['ID']
}

/** Autogenerated return type of LockUser */
export type LockUserPayload = {
  __typename?: 'LockUserPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  user?: Maybe<User>
}

export type Management = {
  __typename?: 'Management'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  descriptionTranslations?: Maybe<Hstore>
  files: Array<File>
  id: Scalars['ID']
  instances?: Maybe<Array<Instance>>
  isDangerSign?: Maybe<Scalars['Boolean']>
  isNeonat?: Maybe<Scalars['Boolean']>
  labelTranslations?: Maybe<Hstore>
  levelOfUrgency?: Maybe<Scalars['Int']>
  reference?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type MedalDataConfigVariable = {
  __typename?: 'MedalDataConfigVariable'
  algorithm?: Maybe<Algorithm>
  apiKey?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  label?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  variable?: Maybe<Variable>
}

export type Mutation = {
  __typename?: 'Mutation'
  acceptInvitation?: Maybe<AcceptInvitationPayload>
  createAlgorithm?: Maybe<CreateAlgorithmPayload>
  createDecisionTree?: Maybe<CreateDecisionTreePayload>
  createDiagnosis?: Maybe<CreateDiagnosisPayload>
  createProject?: Maybe<CreateProjectPayload>
  createUser?: Maybe<CreateUserPayload>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  destroyAlgorithm?: Maybe<DestroyAlgorithmPayload>
  destroyDecisionTree?: Maybe<DestroyDecisionTreePayload>
  destroyDiagnosis?: Maybe<DestroyDiagnosisPayload>
  disable2fa?: Maybe<Disable2faPayload>
  duplicateDecisionTree?: Maybe<DuplicateDecisionTreePayload>
  enable2fa?: Maybe<Enable2faPayload>
  id: Scalars['ID']
  lockUser?: Maybe<LockUserPayload>
  unlockUser?: Maybe<UnlockUserPayload>
  unsubscribeFromProject?: Maybe<UnsubscribeFromProjectPayload>
  updateAlgorithm?: Maybe<UpdateAlgorithmPayload>
  updateDecisionTree?: Maybe<UpdateDecisionTreePayload>
  updateDiagnosis?: Maybe<UpdateDiagnosisPayload>
  updateProject?: Maybe<UpdateProjectPayload>
  updateUser?: Maybe<UpdateUserPayload>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type MutationAcceptInvitationArgs = {
  input: AcceptInvitationInput
}

export type MutationCreateAlgorithmArgs = {
  input: CreateAlgorithmInput
}

export type MutationCreateDecisionTreeArgs = {
  input: CreateDecisionTreeInput
}

export type MutationCreateDiagnosisArgs = {
  input: CreateDiagnosisInput
}

export type MutationCreateProjectArgs = {
  input: CreateProjectInput
}

export type MutationCreateUserArgs = {
  input: CreateUserInput
}

export type MutationDestroyAlgorithmArgs = {
  input: DestroyAlgorithmInput
}

export type MutationDestroyDecisionTreeArgs = {
  input: DestroyDecisionTreeInput
}

export type MutationDestroyDiagnosisArgs = {
  input: DestroyDiagnosisInput
}

export type MutationDisable2faArgs = {
  input: Disable2faInput
}

export type MutationDuplicateDecisionTreeArgs = {
  input: DuplicateDecisionTreeInput
}

export type MutationEnable2faArgs = {
  input: Enable2faInput
}

export type MutationLockUserArgs = {
  input: LockUserInput
}

export type MutationUnlockUserArgs = {
  input: UnlockUserInput
}

export type MutationUnsubscribeFromProjectArgs = {
  input: UnsubscribeFromProjectInput
}

export type MutationUpdateAlgorithmArgs = {
  input: UpdateAlgorithmInput
}

export type MutationUpdateDecisionTreeArgs = {
  input: UpdateDecisionTreeInput
}

export type MutationUpdateDiagnosisArgs = {
  input: UpdateDiagnosisInput
}

export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput
}

export type MutationUpdateUserArgs = {
  input: UpdateUserInput
}

export type Node = {
  __typename?: 'Node'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  descriptionTranslations?: Maybe<Hstore>
  files: Array<File>
  id: Scalars['ID']
  instances?: Maybe<Array<Instance>>
  isDangerSign?: Maybe<Scalars['Boolean']>
  isNeonat?: Maybe<Scalars['Boolean']>
  labelTranslations?: Maybe<Hstore>
  reference?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** The connection type for Node. */
export type NodeConnection = {
  __typename?: 'NodeConnection'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<NodeEdge>>>
  id: Scalars['ID']
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Node>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  totalCount: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** An edge in a connection. */
export type NodeEdge = {
  __typename?: 'NodeEdge'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  id: Scalars['ID']
  /** The item at the end of the edge. */
  node?: Maybe<Node>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>
}

export type Project = {
  __typename?: 'Project'
  algorithms?: Maybe<Array<Algorithm>>
  algorithmsCount?: Maybe<Scalars['Int']>
  consentManagement?: Maybe<Scalars['Boolean']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  description?: Maybe<Scalars['String']>
  drugs?: Maybe<Array<Drug>>
  drugsCount?: Maybe<Scalars['Int']>
  emergencyContentTranslations?: Maybe<Hstore>
  emergencyContentVersion?: Maybe<Scalars['Int']>
  id: Scalars['ID']
  isCurrentUserAdmin?: Maybe<Scalars['Boolean']>
  language?: Maybe<Language>
  managements?: Maybe<Array<Management>>
  managementsCount?: Maybe<Scalars['Int']>
  medalRConfig?: Maybe<Scalars['JSON']>
  name?: Maybe<Scalars['String']>
  questionsSequences?: Maybe<Array<QuestionsSequence>>
  questionsSequencesCount?: Maybe<Scalars['Int']>
  studyDescriptionTranslations?: Maybe<Hstore>
  trackReferral?: Maybe<Scalars['Boolean']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  userProjects?: Maybe<Array<UserProject>>
  variables?: Maybe<Array<Variable>>
  variablesCount?: Maybe<Scalars['Int']>
  villageJson?: Maybe<Scalars['JSON']>
}

/** The connection type for Project. */
export type ProjectConnection = {
  __typename?: 'ProjectConnection'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ProjectEdge>>>
  id: Scalars['ID']
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Project>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  totalCount: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** An edge in a connection. */
export type ProjectEdge = {
  __typename?: 'ProjectEdge'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  id: Scalars['ID']
  /** The item at the end of the edge. */
  node?: Maybe<Project>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type ProjectInput = {
  consentManagement?: InputMaybe<Scalars['Boolean']>
  description?: InputMaybe<Scalars['String']>
  emergencyContentTranslations?: InputMaybe<HstoreInput>
  emergencyContentVersion?: InputMaybe<Scalars['Int']>
  id?: InputMaybe<Scalars['ID']>
  languageId?: InputMaybe<Scalars['ID']>
  name?: InputMaybe<Scalars['String']>
  studyDescriptionTranslations?: InputMaybe<HstoreInput>
  trackReferral?: InputMaybe<Scalars['Boolean']>
  userProjectsAttributes?: InputMaybe<Array<UserProjectInput>>
}

export type Query = {
  __typename?: 'Query'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  getAlgorithm?: Maybe<Algorithm>
  getAlgorithms: AlgorithmConnection
  getComplaintCategories: NodeConnection
  getDecisionTree?: Maybe<DecisionTree>
  getDecisionTrees: DecisionTreeConnection
  getDiagnoses: DiagnosisConnection
  getDiagnosis?: Maybe<Diagnosis>
  getLanguages: Array<Language>
  getLastUpdatedDecisionTrees: DecisionTreeConnection
  getOtpRequiredForLogin: User
  getProject: Project
  getProjects: ProjectConnection
  getQrCodeUri: User
  getUser: User
  getUsers: UserConnection
  getVariables: VariableConnection
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type QueryGetAlgorithmArgs = {
  id: Scalars['ID']
}

export type QueryGetAlgorithmsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  projectId: Scalars['ID']
  searchTerm?: InputMaybe<Scalars['String']>
}

export type QueryGetComplaintCategoriesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  projectId: Scalars['ID']
}

export type QueryGetDecisionTreeArgs = {
  id: Scalars['ID']
}

export type QueryGetDecisionTreesArgs = {
  after?: InputMaybe<Scalars['String']>
  algorithmId: Scalars['ID']
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  searchTerm?: InputMaybe<Scalars['String']>
}

export type QueryGetDiagnosesArgs = {
  after?: InputMaybe<Scalars['String']>
  algorithmId: Scalars['ID']
  before?: InputMaybe<Scalars['String']>
  decisionTreeId?: InputMaybe<Scalars['ID']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  searchTerm?: InputMaybe<Scalars['String']>
}

export type QueryGetDiagnosisArgs = {
  id: Scalars['ID']
}

export type QueryGetLastUpdatedDecisionTreesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  projectId: Scalars['ID']
}

export type QueryGetOtpRequiredForLoginArgs = {
  userId: Scalars['ID']
}

export type QueryGetProjectArgs = {
  id: Scalars['ID']
}

export type QueryGetProjectsArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  searchTerm?: InputMaybe<Scalars['String']>
}

export type QueryGetQrCodeUriArgs = {
  userId: Scalars['ID']
}

export type QueryGetUserArgs = {
  id: Scalars['ID']
}

export type QueryGetUsersArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  projectId?: InputMaybe<Scalars['ID']>
  searchTerm?: InputMaybe<Scalars['String']>
}

export type QueryGetVariablesArgs = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
  last?: InputMaybe<Scalars['Int']>
  projectId: Scalars['ID']
  searchTerm?: InputMaybe<Scalars['String']>
}

export type QuestionsSequence = {
  __typename?: 'QuestionsSequence'
  answers?: Maybe<Array<Answer>>
  components?: Maybe<Array<Instance>>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  cutOffEnd?: Maybe<Scalars['Int']>
  cutOffStart?: Maybe<Scalars['Int']>
  descriptionTranslations?: Maybe<Hstore>
  files: Array<File>
  id: Scalars['ID']
  instances?: Maybe<Array<Instance>>
  isDangerSign?: Maybe<Scalars['Boolean']>
  isNeonat?: Maybe<Scalars['Boolean']>
  labelTranslations?: Maybe<Hstore>
  minScore?: Maybe<Scalars['Int']>
  reference?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export enum RoleEnum {
  Admin = 'admin',
  Clinician = 'clinician',
  DeploymentManager = 'deployment_manager',
}

export type TwoFaInput = {
  code?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  password?: InputMaybe<Scalars['String']>
  userId?: InputMaybe<Scalars['Int']>
}

/** Autogenerated input type of UnlockUser */
export type UnlockUserInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id: Scalars['ID']
}

/** Autogenerated return type of UnlockUser */
export type UnlockUserPayload = {
  __typename?: 'UnlockUserPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  user?: Maybe<User>
}

/** Autogenerated input type of UnsubscribeFromProject */
export type UnsubscribeFromProjectInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id: Scalars['ID']
}

/** Autogenerated return type of UnsubscribeFromProject */
export type UnsubscribeFromProjectPayload = {
  __typename?: 'UnsubscribeFromProjectPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  project?: Maybe<Project>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of UpdateAlgorithm */
export type UpdateAlgorithmInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: AlgorithmInput
}

/** Autogenerated return type of UpdateAlgorithm */
export type UpdateAlgorithmPayload = {
  __typename?: 'UpdateAlgorithmPayload'
  algorithm?: Maybe<Algorithm>
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of UpdateDecisionTree */
export type UpdateDecisionTreeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: DecisionTreeInput
}

/** Autogenerated return type of UpdateDecisionTree */
export type UpdateDecisionTreePayload = {
  __typename?: 'UpdateDecisionTreePayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  decisionTree?: Maybe<DecisionTree>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of UpdateDiagnosis */
export type UpdateDiagnosisInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  existingFilesToRemove?: InputMaybe<Array<Scalars['Int']>>
  filesToAdd?: InputMaybe<Array<Scalars['Upload']>>
  id?: InputMaybe<Scalars['ID']>
  params: DiagnosisInput
}

/** Autogenerated return type of UpdateDiagnosis */
export type UpdateDiagnosisPayload = {
  __typename?: 'UpdateDiagnosisPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  diagnosis?: Maybe<Diagnosis>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of UpdateProject */
export type UpdateProjectInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: ProjectInput
  villages?: InputMaybe<Scalars['Upload']>
}

/** Autogenerated return type of UpdateProject */
export type UpdateProjectPayload = {
  __typename?: 'UpdateProjectPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  project?: Maybe<Project>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** Autogenerated input type of UpdateUser */
export type UpdateUserInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  params: UserInput
}

/** Autogenerated return type of UpdateUser */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload'
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  user?: Maybe<User>
}

export type User = {
  __typename?: 'User'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  email?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  lastName?: Maybe<Scalars['String']>
  lockedAt?: Maybe<Scalars['String']>
  otpProvisioningUri?: Maybe<Scalars['String']>
  otpRequiredForLogin?: Maybe<Scalars['Boolean']>
  otpSecret?: Maybe<Scalars['String']>
  password?: Maybe<Scalars['String']>
  passwordConfirmation?: Maybe<Scalars['String']>
  role?: Maybe<RoleEnum>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  userProjects?: Maybe<Array<UserProject>>
}

/** The connection type for User. */
export type UserConnection = {
  __typename?: 'UserConnection'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<UserEdge>>>
  id: Scalars['ID']
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<User>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  totalCount: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** An edge in a connection. */
export type UserEdge = {
  __typename?: 'UserEdge'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  id: Scalars['ID']
  /** The item at the end of the edge. */
  node?: Maybe<User>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

export type UserInput = {
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['ID']>
  invitationToken?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  password?: InputMaybe<Scalars['String']>
  passwordConfirmation?: InputMaybe<Scalars['String']>
  role?: InputMaybe<Scalars['String']>
  userProjectsAttributes?: InputMaybe<Array<UserProjectInput>>
}

export type UserProject = {
  __typename?: 'UserProject'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  id: Scalars['ID']
  isAdmin?: Maybe<Scalars['Boolean']>
  project?: Maybe<Project>
  projectId?: Maybe<Scalars['ID']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
  userId?: Maybe<Scalars['ID']>
}

export type UserProjectInput = {
  _destroy?: InputMaybe<Scalars['Boolean']>
  id?: InputMaybe<Scalars['ID']>
  isAdmin?: InputMaybe<Scalars['Boolean']>
  projectId?: InputMaybe<Scalars['ID']>
  userId?: InputMaybe<Scalars['ID']>
}

export type Variable = {
  __typename?: 'Variable'
  answerType?: Maybe<AnswerType>
  answers?: Maybe<Array<Answer>>
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  descriptionTranslations?: Maybe<Hstore>
  emergencyStatus?: Maybe<Scalars['Int']>
  files: Array<File>
  formula?: Maybe<Scalars['String']>
  id: Scalars['ID']
  instances?: Maybe<Array<Instance>>
  isDangerSign?: Maybe<Scalars['Boolean']>
  isDefault?: Maybe<Scalars['Boolean']>
  isEstimable?: Maybe<Scalars['Boolean']>
  isIdentifiable?: Maybe<Scalars['Boolean']>
  isMandatory?: Maybe<Scalars['Boolean']>
  isNeonat?: Maybe<Scalars['Boolean']>
  isPreFill?: Maybe<Scalars['Boolean']>
  isReferral?: Maybe<Scalars['Boolean']>
  isUnavailable?: Maybe<Scalars['Boolean']>
  labelTranslations?: Maybe<Hstore>
  maxMessageErrorTranslations?: Maybe<Hstore>
  maxMessageWarningTranslations?: Maybe<Hstore>
  maxValueError?: Maybe<Scalars['Int']>
  maxValueWarning?: Maybe<Scalars['Int']>
  minMessageErrorTranslations?: Maybe<Hstore>
  minMessageWarningTranslations?: Maybe<Hstore>
  minValueError?: Maybe<Scalars['Int']>
  minValueWarning?: Maybe<Scalars['Int']>
  placeholderTranslations?: Maybe<Hstore>
  reference?: Maybe<Scalars['Int']>
  referenceTableFemaleName?: Maybe<Scalars['String']>
  referenceTableMaleName?: Maybe<Scalars['String']>
  round?: Maybe<Scalars['String']>
  stage?: Maybe<Scalars['String']>
  step?: Maybe<Scalars['String']>
  system?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** The connection type for Variable. */
export type VariableConnection = {
  __typename?: 'VariableConnection'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<VariableEdge>>>
  id: Scalars['ID']
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Variable>>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  totalCount: Scalars['Int']
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}

/** An edge in a connection. */
export type VariableEdge = {
  __typename?: 'VariableEdge'
  createdAt?: Maybe<Scalars['ISO8601DateTime']>
  /** A cursor for use in pagination. */
  cursor: Scalars['String']
  id: Scalars['ID']
  /** The item at the end of the edge. */
  node?: Maybe<Variable>
  updatedAt?: Maybe<Scalars['ISO8601DateTime']>
}
