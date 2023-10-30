export type ExportType = 'translations' | 'variables'

export type LoadingStateProps = {
  exportType: ExportType | null
  isLoading: boolean
}
