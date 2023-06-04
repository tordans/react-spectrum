/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {act, render} from '@react-spectrum/test-utils';
import {Checkbox} from '../';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('Checkbox', function () {
  let onChangeSpy = jest.fn();

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  it.each`
    Name                       | Component   | props
    ${'Checkbox'}              | ${Checkbox} | ${{onChange: onChangeSpy}}
    ${'Checkbox isEmphasized'} | ${Checkbox} | ${{onChange: onChangeSpy, isEmphasized: true}}
  `('$Name default unchecked can be checked', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('on');
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();

    userEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);

    userEvent.click(checkbox);
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onChangeSpy.mock.calls[1][0]).toBe(false);

    // would test space key, but then it's just testing the browser, no need
  });

  it.each`
    Name                       | Component   | props
    ${'Checkbox'}              | ${Checkbox} | ${{onChange: onChangeSpy, defaultSelected: true, value: 'newsletter'}}
    ${'Checkbox isEmphasized'} | ${Checkbox} | ${{onChange: onChangeSpy, defaultSelected: true, isEmphasized: true, value: 'newsletter'}}
  `('$Name can be default checked', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('newsletter');
    expect(checkbox.checked).toBeTruthy();

    userEvent.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onChangeSpy.mock.calls[0][0]).toBe(false);
  });

  it.each`
    Name                       | Component   | props
    ${'Checkbox'}              | ${Checkbox} | ${{onChange: onChangeSpy, isSelected: true}}
    ${'Checkbox isEmphasized'} | ${Checkbox} | ${{onChange: onChangeSpy, isSelected: true, isEmphasized: true}}
  `('$Name can be controlled checked', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('on');
    expect(checkbox.checked).toBeTruthy();

    userEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onChangeSpy.mock.calls[0][0]).toBe(false);
  });

  it.each`
    Name                       | Component   | props
    ${'Checkbox'}              | ${Checkbox} | ${{onChange: onChangeSpy, isSelected: false}}
    ${'Checkbox isEmphasized'} | ${Checkbox} | ${{onChange: onChangeSpy, isSelected: false, isEmphasized: true}}
  `('$Name can be controlled unchecked', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('on');
    expect(checkbox.checked).toBeFalsy();

    userEvent.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);
  });

  it.each`
    Name                       | Component   | props
    ${'Checkbox'}              | ${Checkbox} | ${{onChange: onChangeSpy, isDisabled: true}}
    ${'Checkbox isEmphasized'} | ${Checkbox} | ${{onChange: onChangeSpy, isDisabled: true, isEmphasized: true}}
  `('$Name can be disabled', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('on');
    expect(checkbox.checked).toBeFalsy();

    userEvent.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, validationState: 'invalid'}}
  `('$Name can be invalid', function ({Component, props}) {
    let {getByRole} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByRole('checkbox');
    expect(checkbox.value).toBe('on');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, validationState: 'invalid', 'aria-errormessage': 'test'}}
  `('$Name passes through aria-errormessage', function ({Component, props}) {
    let {getByRole} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByRole('checkbox');
    expect(checkbox.value).toBe('on');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-errormessage', 'test');
  });

  it.each`
    Name                       | Component   | props
    ${'Checkbox'}              | ${Checkbox} | ${{onChange: onChangeSpy, isIndeterminate: true}}
    ${'Checkbox isEmphasized'} | ${Checkbox} | ${{onChange: onChangeSpy, isIndeterminate: true, isEmphasized: true}}
  `('$Name can be indeterminate', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('on');
    expect(checkbox.indeterminate).toBeTruthy();
    expect(checkbox.checked).toBeFalsy();

    userEvent.click(checkbox);
    expect(checkbox.indeterminate).toBeTruthy();
    expect(checkbox.checked).toBeTruthy();
    expect(onChangeSpy).toHaveBeenCalled();
    expect(onChangeSpy.mock.calls[0][0]).toBe(true);

    userEvent.click(checkbox);
    expect(checkbox.indeterminate).toBeTruthy();
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy.mock.calls[1][0]).toBe(false);
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, 'aria-label': 'not visible'}}
  `('$Name can have a non-visible label', function ({Component, props}) {
    let {getByRole} = render(<Component {...props} />);

    let checkbox = getByRole('checkbox');
    expect(checkbox.value).toBe('on');
    expect(checkbox).toHaveAttribute('aria-label', props['aria-label']);
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, 'aria-labelledby': 'test'}}
  `('$Name supports aria-labelledby', function ({Component, props}) {
    let {getByRole} = render(
      <>
        <span id="test">Test</span>
        <Component {...props} />
      </>
    );

    let checkbox = getByRole('checkbox');
    expect(checkbox.value).toBe('on');
    expect(checkbox).toHaveAttribute(
      'aria-labelledby',
      props['aria-labelledby']
    );
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, 'aria-describedby': 'test'}}
  `('$Name supports aria-describedby', function ({Component, props}) {
    let {getByRole} = render(
      <>
        <span id="test">Test</span>
        <Component {...props}>Hi</Component>
      </>
    );

    let checkbox = getByRole('checkbox');
    expect(checkbox.value).toBe('on');
    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      props['aria-describedby']
    );
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, 'data-testid': 'target'}}
  `('$Name supports additional props', function ({Component, props}) {
    let {getByTestId} = render(<Component {...props}>Click Me</Component>);

    let checkboxLabel = getByTestId('target');
    expect(checkboxLabel).toBeInTheDocument();
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, excludeFromTabOrder: true}}
  `('$Name supports excludeFromTabOrder', function ({Component, props}) {
    let {getByRole} = render(<Component {...props}>Hi</Component>);

    let checkbox = getByRole('checkbox');
    expect(checkbox.value).toBe('on');
    expect(checkbox).toHaveAttribute('tabIndex', '-1');
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, isSelected: true, isReadOnly: true}}
  `('$Name supports readOnly', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('on');
    expect(checkbox.checked).toBeTruthy();

    userEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it.each`
    Name          | Component   | props
    ${'Checkbox'} | ${Checkbox} | ${{onChange: onChangeSpy, isReadOnly: true}}
  `('$Name supports uncontrolled readOnly', function ({Component, props}) {
    let {getByLabelText} = render(<Component {...props}>Click Me</Component>);

    let checkbox = getByLabelText('Click Me');
    expect(checkbox.value).toBe('on');
    expect(checkbox.checked).toBeFalsy();

    act(() => {
      userEvent.click(checkbox);
    });
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('supports form reset', () => {
    function Test() {
      let [isSelected, setSelected] = React.useState(false);
      return (
        <form>
          <Checkbox data-testid="checkbox" isSelected={isSelected} onChange={setSelected}>Checkbox</Checkbox>
          <input type="reset" data-testid="reset" />
        </form>
      );
    }

    let {getByTestId} = render(<Test />);
    let input = getByTestId('checkbox');

    expect(input).not.toBeChecked();
    act(() => userEvent.click(input));
    expect(input).toBeChecked();

    let button = getByTestId('reset');
    act(() => userEvent.click(button));
    expect(input).not.toBeChecked();
  });

  it('supports validationBehavior', () => {
    let {getByRole, rerender} = render(<Checkbox isRequired>Checkbox</Checkbox>);
    let input = getByRole('checkbox');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).not.toHaveAttribute('required');

    rerender(<Checkbox isRequired validationBehavior="native">Checkbox</Checkbox>);
    expect(input).not.toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('required');
  });

  it('supports native validation', async () => {
    let onValidationChange = jest.fn();
    let {getByTestId, getByRole} = render(
      <form data-testid="form">
        <Checkbox name="test" validationBehavior="native" isRequired onValidationChange={onValidationChange}>Checkbox</Checkbox>
      </form>
    );
    let input = getByRole('checkbox');
    let form = getByTestId('form');

    expect(input).not.toHaveAttribute('aria-invalid');
    expect(onValidationChange).not.toHaveBeenCalled();

    act(() => form.checkValidity());
    expect(input).toHaveAttribute('aria-invalid');
    expect(onValidationChange).toHaveBeenCalledTimes(1);
    expect(onValidationChange).toHaveBeenLastCalledWith({
      isInvalid: true,
      errorMessage: 'Constraints not satisfied',
      validationDetails: {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valueMissing: true,
        valid: false
      }
    });

    act(() => userEvent.click(input));
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(onValidationChange).toHaveBeenCalledTimes(2);
    expect(onValidationChange).toHaveBeenLastCalledWith({
      isInvalid: false,
      errorMessage: '',
      validationDetails: {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valueMissing: false,
        valid: true
      }
    });
  });

  it('supports native custom validation message', async () => {
    let tree = (validationState) => (
      <form data-testid="form">
        <Checkbox name="test" validationBehavior="native" validationState={validationState}>Checkbox</Checkbox>
      </form>
    );

    let {getByRole, rerender} = render(tree('invalid', 'custom'));
    let input = getByRole('checkbox');

    expect(input).toHaveAttribute('aria-invalid');
    expect(input.validity.valid).toBe(false);
    expect(input.validity.customError).toBe(true);

    rerender(tree(undefined, undefined));
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input.validity.valid).toBe(true);
  });

  it('should not set native validation message when validationBehavior=aria', async () => {
    let {getByRole} = render(
      <form data-testid="form">
        <Checkbox name="test" validationState="invalid">Checkbox</Checkbox>
      </form>
    );
    let input = getByRole('checkbox');

    expect(input).toHaveAttribute('aria-invalid');
    expect(input.validity.valid).toBe(true);
  });
});
