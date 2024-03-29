/**
 * The external imports
 */
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { FormulaContext } from '@/lib/contexts'
import {
  DEFAULT_FORMULA_ACTIONS,
  EscapeFormulaActionsEnum,
} from '@/lib/config/constants'
import { useAppRouter } from '@/lib/hooks/useAppRouter'
import { useProject } from '@/lib/hooks/useProject'
import { extractTranslation } from '@/lib/utils/string'
import { useLazyGetFormulaVariablesQuery } from '@/lib/api/modules/enhanced/variable.enhanced'
import { type AutocompleteProps, FormulaAnswerTypeEnum } from '@/types'

const FormulaProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    query: { projectId },
  } = useAppRouter()

  const { projectLanguage } = useProject()

  const { t } = useTranslation('variables')

  const [inputValue, setInputValue] = useState('')
  const [replaceCursor, setReplaceCursor] = useState(0)
  const [autocompleteOptions, setAutocompleteOptions] =
    useState<AutocompleteProps>([])
  const [search, setSearch] = useState('')

  const caretPositionRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const [getFormulaVariables, { data: variables, isSuccess }] =
    useLazyGetFormulaVariablesQuery()

  /**
   * Sets the current caret position to the ref
   */
  const handleCaretChange = () => {
    if (inputRef.current?.selectionStart) {
      caretPositionRef.current = inputRef.current.selectionStart
    }
  }

  /**
   * Search for the open bracket before the caret
   */
  const getStartPosition = () => {
    let start = caretPositionRef.current

    while (
      start >= 0 &&
      !(
        inputRef.current?.value[start] === '[' ||
        inputRef.current?.value[start] === '('
      )
    ) {
      start--
    }

    return start
  }

  /**
   * Search for the close bracket after the caret
   */
  const getEndPosition = () => {
    let end = caretPositionRef.current

    while (
      inputRef.current?.value.length &&
      end < inputRef.current.value.length &&
      !(
        inputRef.current.value[end] === ']' ||
        inputRef.current.value[end] === ')'
      )
    ) {
      end++
    }

    return end
  }

  /**
   * Handles when an option is selected from the menu
   */
  const handleMenuItemClick = (action: string) => {
    let newInputValue = ''
    let startPosition = 0

    const formulaAction = DEFAULT_FORMULA_ACTIONS.find(
      act => act.value === action
    )

    if (formulaAction) {
      startPosition = caretPositionRef.current - 1
      setReplaceCursor(formulaAction.caretActionPosition)
    } else {
      startPosition = getStartPosition() + 1
    }

    newInputValue =
      inputValue.substring(0, startPosition) +
      action +
      inputValue.substring(caretPositionRef.current, inputValue.length)

    caretPositionRef.current = (
      inputValue.substring(0, startPosition) + action
    ).length

    setInputValue(newInputValue)
    setAutocompleteOptions([])
  }

  /**
   * Fill the autocomplete with options that match the text between the [] or ()
   */
  const searchElements = () => {
    // 1. Detect if the caret is wrapped by [] or ()
    const start = getStartPosition()
    const end = getEndPosition()

    // Check if there is a start and end bracket
    if (
      inputRef.current &&
      caretPositionRef.current > 0 &&
      caretPositionRef.current < inputRef.current.value.length &&
      ((inputRef.current.value[start] === '[' &&
        inputRef.current.value[end] === ']') ||
        (inputRef.current.value[start] === '(' &&
          inputRef.current.value[end] === ')'))
    ) {
      // 2. If so, extract the text that is between those [], () and use it to search
      const searchText = inputRef.current.value.substring(start + 1, end)

      if (searchText.length > 0) {
        setSearch(searchText)
      } else {
        setAutocompleteOptions([])
      }
    }
  }

  /**
   * Define and initialize the keyboard events to be tracked
   */
  useEffect(() => {
    const keyboardEvents = (event: KeyboardEvent) => {
      handleCaretChange()
      if (event.key === '/') {
        const defaultOptions = DEFAULT_FORMULA_ACTIONS.map(action => ({
          label: t(`formulaFunctions.${action.key}`),
          value: action.value,
        }))
        setAutocompleteOptions(defaultOptions)
      } else if (
        [
          EscapeFormulaActionsEnum.Space,
          EscapeFormulaActionsEnum.Escape,
        ].includes(event.key as EscapeFormulaActionsEnum)
      ) {
        setAutocompleteOptions([])
      } else if (event.key === EscapeFormulaActionsEnum.Backspace) {
        if (
          autocompleteOptions.some(
            act => act.value === DEFAULT_FORMULA_ACTIONS[0].value
          )
        ) {
          setAutocompleteOptions([])
        } else {
          searchElements()
        }
      } else if (/^[a-zA-Z]|{To(Day|Month)\(([^)]+)\)}$/.test(event.key)) {
        searchElements()
      }
    }

    // Add event listeners
    inputRef.current?.addEventListener('keyup', keyboardEvents)
    inputRef.current?.addEventListener('click', handleCaretChange)

    return () => {
      // Remove event listeners when the component unmounts
      inputRef.current?.removeEventListener('keyup', keyboardEvents)
      inputRef.current?.removeEventListener('click', handleCaretChange)
    }
  }, [])

  /**
   * Fetch projects on search term change
   */
  useEffect(() => {
    if (search.length > 0 && inputRef.current) {
      getFormulaVariables({
        projectId,
        searchTerm: search,
        first: 5,
        answerType:
          inputRef.current.value[caretPositionRef.current] === ']'
            ? FormulaAnswerTypeEnum.Numeric
            : FormulaAnswerTypeEnum.Date,
      })
    }
  }, [search, projectId])

  /**
   * Transform the variables to be displayable by the menu
   */
  useEffect(() => {
    if (isSuccess && variables) {
      const results = variables.edges.map(variable => ({
        label: `${variable.node.fullReference} - ${extractTranslation(
          variable.node.labelTranslations,
          projectLanguage
        )}`,
        value: variable.node.id,
      }))

      if (results.length > 0) {
        setAutocompleteOptions(results)
      } else {
        setAutocompleteOptions([
          { label: t('noOptions', { ns: 'common' }), value: '' },
        ])
      }
    }
  }, [variables])

  /**
   * Move cursor to between the () or []
   */
  useEffect(() => {
    if (replaceCursor && inputRef.current) {
      inputRef.current.setSelectionRange(
        caretPositionRef.current - replaceCursor,
        caretPositionRef.current - replaceCursor
      )

      setReplaceCursor(0)

      handleCaretChange()
    }
  }, [replaceCursor])

  return (
    <FormulaContext.Provider
      value={{
        inputRef,
        autocompleteOptions,
        setAutocompleteOptions,
        searchElement: search,
        inputValue,
        setInputValue,
        handleMenuItemClick,
      }}
    >
      {children}
    </FormulaContext.Provider>
  )
}

export default FormulaProvider
