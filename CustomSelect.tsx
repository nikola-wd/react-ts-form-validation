import React, { useState, useEffect, useRef, Ref } from 'react';

interface CustomSelectOption {
  id: number;
  value: string;
  label: string;
}

// TODO: Maybe move this to global types
interface ReducerFormFieldType {
  value: string;
  label: string;
  id: number;
  placeholder?: string;
  validation: {
    [key: string]: string | number | boolean;
  };
  type: string;
  dirty: boolean;
  valid: boolean;
  options: CustomSelectOption[] | null;
}

interface FormFieldsReducerState {
  [key: string]: ReducerFormFieldType;
}

interface CustomSelectProps {
  options: Array<CustomSelectOption> | null;
  activeOption: number | null;
  onChange: (selectedOption: CustomSelectOption) => void;
  validationCls: string;
  handleValidateAllFields: () => void;
  formState: FormFieldsReducerState;
  name: string;
}

const CustomSelect = (props: CustomSelectProps) => {
  const {
    options,
    activeOption,
    onChange,
    validationCls,
    handleValidateAllFields,
    formState,
    name,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const ddRef: Ref<HTMLDivElement> = useRef(null);

  let customSelectValue = formState[name].value;
  let customSelectLabel = formState[name].label;
  let customSelectId = formState[name].id;

  const handleSelectNew = (optionObj: CustomSelectOption) => {
    onChange(optionObj);
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
  }, []);

  const handleClickOutside = (e: { target: any }) => {
    if (ddRef.current && !ddRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    handleValidateAllFields();
  }, [customSelectValue, handleValidateAllFields]);

  return (
    <div>
      <div ref={ddRef} className={`dropdown ${isOpen ? 'show' : ''}`}>
        <button
          type="button"
          className="w-full rounded px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/70 text-white text-left text-ellipsis overflow-hidden md:h-[50px]"
          onClick={() => setIsOpen((prevOpen) => !prevOpen)}
        >
          <span>{customSelectLabel}</span>
        </button>
        <div
          className={`w-full rounded p-3 sm:px-4 border
                            border-white/70 bg-white/10 absolute top-14 z-10 ${
                              isOpen ? 'block' : 'hidden'
                            }`}
        >
          {options &&
            options.map((option) => {
              const isActive = activeOption === customSelectId;

              return (
                <div key={option.value}>
                  <button
                    type="button"
                    className={`w-full rounded px-3 sm:px-4 py-2 sm:py-3 ${
                      !isActive ? 'bg-white/10' : 'bg-white/40'
                    } hover:bg-white/40 border border-white/70 text-white text-left mb-1 transition ${
                      isActive ? 'active' : ''
                    }`}
                    data-value={option.value}
                    onClick={() => handleSelectNew(option)}
                  >
                    {option.label}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
