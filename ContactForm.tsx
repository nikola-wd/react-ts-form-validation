import React, { useState, useReducer, useEffect } from 'react';
import { useContactForm } from './useContactForm';

import CustomSelect from './CustomSelect';

import './style.css';

export default function ContactForm() {
  const {
    state,
    dispatch,
    formDirty,
    allFieldsValid,
    loading,
    handleUpdateField,
    handleValidateAllFields,
    tryFormSubmit,
    getFieldStateCls,
  } = useContactForm();

  return (
    <div>
      {formDirty ? 'Form Dirty' : 'Form Not Dirty'}
      <br />
      {allFieldsValid ? 'All Fields Valid' : 'Not All Fields Valid'}
      <br />
      {state.interest.label}
      <form onSubmit={tryFormSubmit} noValidate>
        <input
          type="text"
          value={state.name.value}
          onChange={handleUpdateField}
          onKeyUp={handleValidateAllFields}
          placeholder={state.name.placeholder}
          name="name"
          className={`${getFieldStateCls('name')}`}
        />
        <pre>
          <code>{JSON.stringify(state.name, null, 2)}</code>
        </pre>

        <input
          type="email"
          value={state.email.value}
          onChange={handleUpdateField}
          onKeyUp={handleValidateAllFields}
          placeholder={state.email.placeholder}
          name="email"
          className={`${getFieldStateCls('email')}`}
        />
        <pre>
          <code>{JSON.stringify(state.email, null, 2)}</code>
        </pre>

        <CustomSelect
          formState={state}
          dispatch={dispatch}
          activeOption={state.interest.id}
          name="interest"
          onChange={(selectedOption) =>
            handleUpdateField(
              null,
              'interest',
              selectedOption.value,
              selectedOption.label,
              selectedOption.id
            )
          }
          handleValidateAllFields={handleValidateAllFields}
          validationCls={`${getFieldStateCls('interest')}`}
          options={state.interest.options}
        />
        <pre>
          <code>{JSON.stringify(state.interest, null, 2)}</code>
        </pre>

        <textarea
          value={state.message.value}
          onChange={handleUpdateField}
          onKeyUp={handleValidateAllFields}
          placeholder={state.message.placeholder}
          name="message"
          className={`${getFieldStateCls('message')}`}
        />
        <pre>
          <code>{JSON.stringify(state.message, null, 2)}</code>
        </pre>

        <button type="submit">{!loading ? 'SUBMIT' : '...'}</button>

        {formDirty && !allFieldsValid && (
          <h4
            style={{
              color: '#fff',
              backgroundColor: 'crimson',
              padding: '6px',
            }}
          >
            Please populate all the fields correctly and try again
          </h4>
        )}
      </form>
    </div>
  );
}
