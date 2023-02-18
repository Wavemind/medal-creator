export type UserProject = {
  id: number
  userId: number
  projectId: number
  isAdmin: boolean
  _destroy?: boolean
}

export type UserProjectInputs = {
  userId: number
  isAdmin: boolean
}
