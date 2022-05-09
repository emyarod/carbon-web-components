/**
 * @license
 *
 * Copyright IBM Corp. 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { customElement, html, LitElement, property, query, queryAssignedNodes } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import settings from 'carbon-components/es/globals/js/settings';
import CaretDown16 from '@carbon/icons/lib/caret--down/16';
import HostListenerMixin from '../../globals/mixins/host-listener';
import styles from './treeview.scss';

const { prefix } = settings;

/**
 * Tree node.
 * @element bx-tree-node
 */
@customElement(`${prefix}-tree-node`)
export default class BXTreeNode extends HostListenerMixin(LitElement) {
  /**
   * Array of child tree nodes.
   */
  // TODO: in lit 2.x replace _defaultSlottedTreeNodes @query decorator
  // @queryAssignedElements('')
  // private defaultElements;
  @queryAssignedNodes('', false, `${prefix}-tree-node`)
  private _defaultSlottedTreeNodes!: HTMLSlotElement[] | BXTreeNode[];

  @query(`.${prefix}--tree-node__label`)
  private currentNodeLabel;

  // FIXME: possibly remove
  @queryAssignedNodes('icon')
  private _iconNodes!: HTMLSlotElement[];

  /**
   * `true` if this tree node is active.
   */
  @property({ type: Boolean, reflect: true })
  active = false;

  /**
   * tree node depth to determine spacing, automatically calculated by default.
   */
  @property({ type: Number })
  depth = 0;

  /**
   * `true` if this tree node should be disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * `true` if this tree node is expanded (only applicable to parent nodes).
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * `true` if this tree node is selected.
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * The value of the tree node
   */
  @property({ type: String, reflect: true })
  value = '';

  createRenderRoot() {
    return this.attachShadow({
      mode: 'open',
      delegatesFocus: Number((/Safari\/(\d+)/.exec(navigator.userAgent) ?? ['', 0])[1]) <= 537,
    });
  }

  /**
   * Handles `slotchange` event.
   */
  private _handleSlotChange() {
    this.requestUpdate();
  }

  private _handleToggleClick() {
    const { disabled, expanded } = this;
    if (disabled) {
      return;
    }
    this.requestUpdate();
    this.expanded = !expanded;
    const init = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        expanded: !expanded,
      },
    };
    this.dispatchEvent(new CustomEvent((this.constructor as typeof BXTreeNode).eventToggleClick, init));
  }

  updated() {
    const { currentNodeLabel, depth, disabled, _defaultSlottedTreeNodes: children } = this;
    // console.log(this.value, depth, children);
    children?.forEach(childNode => {
      childNode.depth = depth + 1;
      childNode.disabled = disabled;
      // // onTreeSelect
      // childNode.tabindex = (!childNode.disabled && -1) || null;
    });

    const calcOffset = () => {
      // parent node
      if (children?.length) {
        return depth + 1;
      }
      // TODO:
      // leaf node with icon
      // if (Icon) {
      //   return depth + 2;
      // }
      // leaf node without icon
      return depth + 2.5;
    };

    // console.log(this.querySelector((this.constructor as typeof BXTreeNode).selectorTreeNodeLabel));
    if (currentNodeLabel) {
      (currentNodeLabel as HTMLElement).style.marginLeft = `-${calcOffset()}rem`;
      (currentNodeLabel as HTMLElement).style.paddingLeft = `${calcOffset()}rem`;
      // console.log(`${calcOffset()}rem`, this.value);
    }
  }

  protected _renderToggle() {
    const { disabled, expanded, _handleToggleClick: handleToggleClick, _defaultSlottedTreeNodes: children } = this;

    const toggleClasses = `${prefix}--tree-parent-node__toggle-icon${
      expanded ? ` ${prefix}--tree-parent-node__toggle-icon--expanded` : ''
    }`;

    if (!children?.length) {
      return null;
    }

    return html`<span class="${prefix}--tree-parent-node__toggle" disabled=${disabled} @click=${handleToggleClick}>
      ${CaretDown16({
        // part: 'toggle-icon',
        class: toggleClasses,
      })}
    </span>`;
  }

  protected _renderLabelDetails() {
    const { _defaultSlottedTreeNodes: children } = this;

    if (!children?.length) {
      return html`<slot name="icon"></slot><slot name="label"></slot>`;
    }
    // console.log(this.defaultNodes.filter(node => node.tagName === 'BX-TREE-NODE'));

    return html` <span part="label-details" class="${prefix}--tree-node__label__details">
      <slot name="icon"></slot>
      <slot name="label"></slot>
    </span>`;
  }

  protected _renderContent() {
    const { disabled, expanded, _handleSlotChange: handleSlotChange, _defaultSlottedTreeNodes: children } = this;
    // TODO: probably new styles based on [expanded] attr/prop
    // console.log(this.value, 'expanded', expanded, 'children', children?.assignedElements().length);

    // if (!children) {
    //   console.log('1', this.value);
    //   return html`<slot @slotchange="${handleSlotChange}" style="opacity:0"></slot>`;
    // }

    // if (!expanded) {
    //   console.log('2', this.value);
    //   return html`<slot @slotchange="${handleSlotChange}" style="opacity:0"></slot>`;
    // }

    return html`<ul role="group" part="children" class="${prefix}--tree-node__children">
      <slot @slotchange="${handleSlotChange}"></slot>
    </ul>`;
  }

  render() {
    const { active, depth, disabled, expanded, selected, _defaultSlottedTreeNodes: children } = this;
    // TODO: uncomment necessary classes
    const treeNodeClasses = classMap({
      [`${prefix}--tree-node`]: true,
      // [`${prefix}--tree-node--active`]: isActive,
      [`${prefix}--tree-node--disabled`]: disabled,
      // [`${prefix}--tree-node--selected`]: isSelected,
      // [`${prefix}--tree-node--with-icon`]: Icon,
      [`${prefix}--tree-leaf-node`]: !children?.length,
      [`${prefix}--tree-parent-node`]: children?.length,
    });

    // console.log(this.value, this._iconNodes);

    // console.log('render', this.value);
    // console.log('_', this._defaultSlottedTreeNodes);
    // console.log('dqs', this.shadowRoot?.querySelector('slot:not([name])'));
    // console.log('defaultNodes', this.defaultNodes);
    // console.log('labelNode', this.currentNodeLabel);
    // console.log('\n');

    // ${expanded
    //   ? html`<ul role="group" class="${prefix}--tree-node__children">
    //       <slot @slotchange="${handleSlotChange}"></slot>
    //     </ul>`
    //   : null}

    // ${this._renderExpandedContent()}

    // TODO: add additional treeNodeProps

    return html`<li
      class="${treeNodeClasses}"
      aria-current=${ifDefined(active || undefined)}
      aria-disabled=${ifDefined(disabled || undefined)}
      aria-expanded=${ifDefined(children?.length ? !!expanded : undefined)}
      aria-selected=${ifDefined(disabled ? undefined : selected)}
      part="item"
      role="treeitem">
      <div part="node-label" class="${prefix}--tree-node__label">${this._renderToggle()}${this._renderLabelDetails()}</div>
      ${this._renderContent()}
    </li>`;
  }

  // FIXME: possibly remove
  // /**
  //  * A selector that will return the tree node label.
  //  */
  // static get selectorTreeNodeLabel() {
  //   return '[slot="label"]';
  // }

  /**
   * The name of the custom event fired after a parent node's toggle button is
   * clicked.
   */
  static get eventToggleClick() {
    return `${prefix}-tree-node-toggleclick`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom Webpack loader
}
