import { useState, useReducer, SyntheticEvent } from 'react';

interface CustomSelectOption {
  id: number;
  value: string;
  label: string;
}

const selectOptions: CustomSelectOption[] = [
  {
    id: 0,
    value: 'Select one option',
    label: 'Select one option',
  },
  {
    id: 1,
    value: 'Have an engineering team, want to augment 🤘',
    label: 'Have an engineering team, want to augment 🤘',
  },
  {
    id: 2,
    value: 'Looking for a standalone product team 🧑‍🚀',
    label: 'Looking for a standalone product team 🧑‍🚀',
  },
  {
    id: 3,
    value: 'Still defining the team, looking for magic ⚡️',
    label: 'Still defining the team, looking for magic ⚡️',
  },
];

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

const initialFieldsStates: FormFieldsReducerState = {
  name: {
    value: 'asdasdasd',
    label: '',
    id: -1,
    type: 'text',
    placeholder: 'Name',
    validation: {
      min: 2,
    },
    dirty: false,
    valid: true,
    options: null,
  },
  email: {
    value: '',
    label: '',
    id: -1,
    placeholder: 'Email',
    type: 'email',
    validation: {
      min: 4,
      email: true,
    },
    dirty: false,
    valid: true,
    options: null,
  },
  interest: {
    value: selectOptions[0].value,
    label: selectOptions[0].label,
    id: selectOptions[0].id,
    type: 'custom-select',
    options: selectOptions,
    validation: {
      customSelect: 0,
    },
    dirty: false,
    valid: true,
  },
  message: {
    value: '',
    label: '',
    id: -1,
    type: 'text',
    placeholder: 'Message',
    validation: {
      min: 50,
    },
    dirty: false,
    valid: true,
    options: null,
  },
};

const validateEmail = (emailString: string) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(emailString);
};

const validateField = (
  state: FormFieldsReducerState,
  fieldName: string,
  fieldValue: string | CustomSelectOption
) => {
  let valid = true;
  if (!state[fieldName].hasOwnProperty('validation')) return valid;

  Object.entries(state[fieldName].validation).forEach(
    ([validationKey, validationValue]) => {
      if (
        validationKey === 'min' &&
        typeof fieldValue === 'string' &&
        typeof validationValue === 'number'
      ) {
        if (fieldValue.length < validationValue) {
          valid = valid && false;
        }
      }
      if (validationKey === 'email' && typeof fieldValue === 'string') {
        valid = valid && validateEmail(fieldValue);
      }

      if (validationKey === 'customSelect' && typeof fieldValue !== 'string') {
        valid = valid && validationValue !== fieldValue.id;
      }
    }
  );
  return !!valid;
};

type FormReducerAction =
  | { type: 'setDirty'; name: string }
  | { type: 'setAllDirty' }
  | {
      type: 'update';
      name: string;
      value: string;
      label?: string;
      id?: number;
    }
  | { type: 'isValid'; name: string; isValid: boolean };

const validationReducer = (
  state: FormFieldsReducerState,
  action: FormReducerAction
) => {
  const updatedState = { ...state };

  switch (action.type) {
    case 'setDirty':
      updatedState[action.name] = {
        ...updatedState[action.name],
        dirty: true,
      };
      return { ...updatedState };
    case 'setAllDirty':
      Object.keys(updatedState).forEach((fieldName) => {
        updatedState[fieldName] = {
          ...updatedState[fieldName],
          dirty: true,
        };
      });
      return { ...updatedState };
    case 'update':
      const updatedField = {
        ...updatedState[action.name],
        value: action.value,
      };
      if (
        action.hasOwnProperty('label') &&
        action.label !== undefined &&
        action.hasOwnProperty('id') &&
        action.id !== undefined
      ) {
        updatedField.label = action.label;
        updatedField.id = action.id;
      }
      updatedState[action.name] = {
        ...updatedField,
      };
      return { ...updatedState };
    case 'isValid':
      updatedState[action.name] = {
        ...updatedState[action.name],
        valid: action.isValid,
      };
      return { ...updatedState };
    default:
      return state;
  }
};

const useContactForm = () => {
  const [state, dispatch] = useReducer(validationReducer, initialFieldsStates);
  const [formDirty, setFormDirty] = useState(false);
  const [allFieldsValid, setAllFieldsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFieldStateCls = (fieldName: string) => {
    if (!formDirty && !state[fieldName].dirty) {
      return '';
    }

    if (formDirty && state[fieldName].dirty) {
      if (!state[fieldName].valid) {
        return 'error';
      } else if (state[fieldName].valid) {
        return 'valid';
      }
    }
  };
  // validateField
  const tryFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormDirty(true);
    dispatch({ type: 'setAllDirty' });

    // If not all invalid, continue
    if (!formDirty) {
      handleValidateAllFields();
    }
    if (!allFieldsValid) {
      setLoading(false);
      return;
    }

    // TODO: If request successful, then setLoading to false
    setLoading(false);
    alert('Continue now');
  };

  const handleUpdateField = (
    e: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement> | null,
    fieldName = '',
    fieldValue = '',
    fieldValueLabel?: string,
    fieldValueId?: number
  ) => {
    let name = fieldName,
      value = fieldValue;

    if (e !== null) {
      name = e.currentTarget.name;
      value = e.currentTarget.value;
    }

    if (!formDirty && !state[name].dirty) {
      dispatch({ type: 'setDirty', name: name });
    }

    if (fieldValueLabel && fieldValueId !== undefined) {
      dispatch({
        type: 'update',
        name: name,
        value: value,
        label: fieldValueLabel,
        id: fieldValueId,
      });
    } else {
      dispatch({ type: 'update', name: name, value: value });
    }
  };

  const handleValidateAllFields = () => {
    let allFieldsValidStates = true;

    Object.keys(state).forEach((fieldName) => {
      let fieldValidState = validateField(
        state,
        fieldName,
        state[fieldName].value
      );

      allFieldsValidStates = allFieldsValidStates && fieldValidState;

      dispatch({
        type: 'isValid',
        name: fieldName,
        isValid: fieldValidState,
      });
    });

    setAllFieldsValid(!!allFieldsValidStates);
    return !!allFieldsValidStates;
  };

  return {
    state,
    dispatch,
    formDirty,
    allFieldsValid,
    loading,
    handleUpdateField,
    handleValidateAllFields,
    tryFormSubmit,
    getFieldStateCls,
  };
};

export { useContactForm };
