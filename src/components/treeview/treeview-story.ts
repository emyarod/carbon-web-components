/**
 * @license
 *
 * Copyright IBM Corp. 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit-element';
import { action } from '@storybook/addon-actions';
//  import { boolean, select } from '@storybook/addon-knobs';
// Below path will be there when an application installs `carbon-web-components` package.
// In our dev env, we auto-generate the file and re-map below path to to point to the generated file.
// @ts-ignore
import Document16 from 'carbon-web-components/es/icons/document/16';
// @ts-ignore
import Folder16 from 'carbon-web-components/es/icons/folder/16';
import spread from '../../globals/directives/spread';
//  import textNullable from '../../../.storybook/knob-text-nullable';
//  import ifNonNull from '../../globals/directives/if-non-null';
import './treeview';
import './treenode';
import styles from './treeview-story.scss';
//  import storyDocs from './treeview-story.mdx';

const nodes = [
  {
    id: '1',
    value: 'Artificial intelligence',
    label: html`<span>Artificial intelligence</span>`,
    icon: Document16,
  },
  {
    id: '2',
    value: 'Blockchain',
    label: 'Blockchain',
    icon: Document16,
  },
  {
    id: '3',
    value: 'Business automation',
    label: 'Business automation',
    icon: Folder16,
    children: [
      {
        id: '3-1',
        value: 'Business process automation',
        label: 'Business process automation',
        icon: Document16,
      },
      {
        id: '3-2',
        value: 'Business process mapping',
        label: 'Business process mapping',
        icon: Document16,
      },
    ],
  },
  {
    id: '4',
    value: 'Business operations',
    label: 'Business operations',
    icon: Document16,
  },
  {
    id: '5',
    value: 'Cloud computing',
    label: 'Cloud computing',
    expanded: true,
    icon: Folder16,
    children: [
      {
        id: '5-1',
        value: 'Containers',
        label: 'Containers',
        icon: Document16,
      },
      {
        id: '5-2',
        value: 'Databases',
        label: 'Databases',
        icon: Document16,
      },
      {
        id: '5-3',
        value: 'DevOps',
        label: 'DevOps',
        expanded: true,
        icon: Folder16,
        children: [
          {
            id: '5-4',
            value: 'Solutions',
            label: 'Solutions',
            icon: Document16,
          },
          {
            id: '5-5',
            value: 'Case studies',
            label: 'Case studies',
            expanded: true,
            icon: Folder16,
            children: [
              {
                id: '5-6',
                value: 'Resources',
                label: 'Resources',
                icon: Document16,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '6',
    value: 'Data & Analytics',
    label: 'Data & Analytics',
    icon: Folder16,
    children: [
      {
        id: '6-1',
        value: 'Big data',
        label: 'Big data',
        icon: Document16,
      },
      {
        id: '6-2',
        value: 'Business intelligence',
        label: 'Business intelligence',
        icon: Document16,
      },
    ],
  },
  {
    id: '7',
    value: 'IT infrastructure',
    label: 'IT infrastructure',
    expanded: true,
    disabled: true,
    icon: Folder16,
    children: [
      {
        id: '7-1',
        value: 'Data storage',
        label: 'Data storage',
        icon: Document16,
      },
      {
        id: '7-2',
        value: 'Enterprise servers',
        label: 'Enterprise servers',
        icon: Document16,
      },
      {
        id: '8',
        value: 'Hybrid cloud infrastructure',
        label: 'Hybrid cloud infrastructure',
        expanded: true,
        icon: Folder16,
        children: [
          {
            id: '8-1',
            value: 'Insights',
            label: 'Insights',
            icon: Document16,
          },
          {
            id: '8-2',
            value: 'Benefits',
            label: 'Benefits',
            icon: Document16,
          },
        ],
      },
    ],
  },
];

function renderTree({ treenodes, expandAll, withIcons = false }: any) {
  if (!treenodes) {
    return [];
  }
  // key={nodeProps.id} renderIcon={withIcons ? renderIcon : null} expanded={expanded ?? expanded} {...nodeProps}
  return treenodes.map(
    ({ children, icon, expanded, label, ...nodeProps }) =>
      console.log(expanded, nodeProps) ||
      html`
        <bx-tree-node ?expanded="${expandAll ?? expanded}" ...="${spread(nodeProps)}">
          ${withIcons ? icon({ slot: 'icon' }) : null}
          <span slot="label">${label}</span>
          ${renderTree({ treenodes: children, expandAll, withIcons })}
        </bx-tree-node>
      `
  );
}

export const Default = args => {
  return html`
    <style>
      ${styles}
    </style>
    <bx-tree>${renderTree({ treenodes: nodes })}</bx-tree>
  `;
};

Default.storyName = 'Default';

Default.parameters = {};

export const WithIcons = args => {
  return html`
    <style>
      ${styles}
    </style>
    <bx-tree>${renderTree({ treenodes: nodes, withIcons: true })}</bx-tree>
  `;
};

WithIcons.storyName = 'With icons';

WithIcons.parameters = {};

export default {
  title: 'Components/Tree view',
  // TODO:
  //  parameters: {
  //    ...storyDocs.parameters,
  //  },
};
