import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AutocompleteInputProps {
  value: string
  suggestions: string[]
  onChange: (value: string) => void
  onSelect?: (value: string) => void
  placeholder?: string
  name?: string
  id?: string
  required?: boolean
  className?: string
  allowNewValues?: boolean
}

export default function AutocompleteInput({
  value,
  suggestions,
  onChange,
  onSelect,
  placeholder,
  name,
  id,
  required,
  className,
  allowNewValues = false,
}: AutocompleteInputProps) {
  const [filtered, setFiltered] = useState<string[]>([])
  const [show, setShow] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    
    // Filter suggestions based on input
    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    
    // Call onChange with the value directly
    onChange(value);
  }

  const handleSelect = (option: string) => {
    onChange(option)
    if (onSelect) onSelect(option)
    setShow(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value && allowNewValues && !suggestions.includes(value)) {
      e.preventDefault()
      if (onSelect) onSelect(value)
      setShow(false)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        className={cn(
          "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        name={name}
        id={id}
        required={required}
        autoComplete="off"
      />
      {showSuggestions && (filteredSuggestions.length > 0 || (allowNewValues && inputValue)) && (
        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 border rounded shadow max-h-60 overflow-auto">
          {filteredSuggestions.map((option) => (
            <li
              key={option}
              className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
          {allowNewValues && inputValue && !suggestions.includes(inputValue) && (
            <li
              className="px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer text-blue-600 dark:text-blue-400"
              onClick={() => handleSelect(inputValue)}
            >
              Create new: {inputValue}
            </li>
          )}
        </ul>
      )}
    </div>
  )
} 