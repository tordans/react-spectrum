/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {ComboBoxTester, ComboBoxTesterOpts} from './combobox';
import {GridListTester, GridListTesterOpts} from './gridlist';
import {MenuTester, MenuTesterOpts} from './menu';
import {pointerMap} from './';
import {SelectTester, SelectTesterOpts} from './select';
import {TableTester, TableTesterOpts} from './table';
import userEvent from '@testing-library/user-event';

// https://github.com/testing-library/dom-testing-library/issues/939#issuecomment-830771708 is an interesting way of allowing users to configure the timers
// curent way is like https://testing-library.com/docs/user-event/options/#advancetimers,
export interface UserOpts {
  /**
   * The interaction type (mouse, touch, keyboard) that the test util user will use when interacting with a component. This can be overridden
   * at the aria pattern util level if needed.
   * @default mouse
   */
  interactionType?: 'mouse' | 'touch' | 'keyboard',
  // If using fake timers user should provide something like (time) => jest.advanceTimersByTime(time))}
  // A real timer user would pass async () => await new Promise((resolve) => setTimeout(resolve, waitTime))
  // Time is in ms.
  /**
   * A function used by the test utils to advance timers during interactions. Required for certain aria patterns (e.g. table).
   */
  advanceTimer?: (time?: number) => void | Promise<unknown>
}

export interface BaseTesterOpts {
  // The base element for the given tester (e.g. the table, menu trigger, etc)
  root: HTMLElement
}

let keyToUtil = {'Select': SelectTester, 'Table': TableTester, 'Menu': MenuTester, 'ComboBox': ComboBoxTester, 'GridList': GridListTester} as const;
export type PatternNames = keyof typeof keyToUtil;

// Conditional type: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
type Tester<T> =
    T extends 'Select' ? SelectTester :
    T extends 'Table' ? TableTester :
    T extends 'Menu' ? MenuTester :
    T extends 'ComboBox' ? ComboBoxTester :
    T extends 'GridList' ? GridListTester :
    never;

type TesterOpts<T> =
  T extends 'Select' ? SelectTesterOpts :
  T extends 'Table' ? TableTesterOpts :
  T extends 'Menu' ? MenuTesterOpts :
  T extends 'ComboBox' ? ComboBoxTesterOpts :
  T extends 'GridList' ? GridListTesterOpts :
  never;

let defaultAdvanceTimer = async (waitTime: number | undefined) => await new Promise((resolve) => setTimeout(resolve, waitTime));

export class User {
  private user;
  /**
   * The interaction type (mouse, touch, keyboard) that the test util user will use when interacting with a component. This can be overridden
   * at the aria pattern util level if needed.
   * @default mouse
   */
  interactionType: UserOpts['interactionType'];
  /**
   * A function used by the test utils to advance timers during interactions. Required for certain aria patterns (e.g. table).
   */
  advanceTimer: UserOpts['advanceTimer'];

  constructor(opts: UserOpts = {}) {
    let {interactionType, advanceTimer} = opts;
    this.user = userEvent.setup({delay: null, pointerMap});
    this.interactionType = interactionType;
    this.advanceTimer = advanceTimer || defaultAdvanceTimer;
  }

  /**
   * Creates an aria pattern tester, inheriting the options provided to the original user.
   */
  createTester<T extends PatternNames>(patternName: T, opts: TesterOpts<T>): Tester<T> {
    return new (keyToUtil)[patternName]({...opts, user: this.user, interactionType: this.interactionType, advanceTimer: this.advanceTimer}) as Tester<T>;
  }
}
