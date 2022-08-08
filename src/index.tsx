import { MemoryRouter as Router } from 'react-router-dom';
import { CacheProvider, CSSObject, ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material';
import { AutTheme } from './theme';
import store from './store/store';
import { EventsHandlerWrapper } from './components/EventsHandlerWrapper';
import SwAuthModal, { AutButton } from './Aut';
import { AttributeCallbackFn, SwAuthConfig } from './types/sw-auth-config';
import { AttributeNames, createShadowElement, extractAttributes, isElement } from './utils/utils';
import Web3AutProvider from './services/ProviderFactory/web3.aut.provider';

export function Init(authConfig: SwAuthConfig<CSSObject> = null) {
  const TAG_NAME = 'd-aut';
  // we don't to initialized again when saving changes on hot-reloading
  if (customElements.get(TAG_NAME)) {
    return;
  }
  customElements.define(
    TAG_NAME,
    class extends HTMLElement {
      public childAttrCalback: AttributeCallbackFn;

      static get observedAttributes() {
        // Add all tracked attributes to this array
        return [AttributeNames.hideButton, AttributeNames.disableCreateNewUser];
      }

      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (this.childAttrCalback) this.childAttrCalback(name, oldValue, newValue);
      }

      setAttributeChangeCallback = (callBack: AttributeCallbackFn) => {
        if (callBack) this.childAttrCalback = callBack;
      };

      connectedCallback() {
        const jss = create(jssPreset());
        const attributes = extractAttributes(this);

        let content: JSX.Element = null;
        let mountPoint: HTMLElement = null;

        if (authConfig?.container) {
          if (!isElement(authConfig.container)) {
            throw new Error('Container is not of type HTMLElement');
          }
          Object.assign(authConfig.container.style, {
            position: 'absolute',
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            overflow: 'hidden',
            ...(authConfig.containerStyles || {}),
          });
          const mConfig = createShadowElement({ container: authConfig.container, className: 'sw-auth-modal' });
          const bConfig = createShadowElement({ container: this, className: 'sw-auth-button' });
          mountPoint = mConfig.mountPoint;
          content = (
            <>
              <CacheProvider value={bConfig.cache}>
                <AutButton
                  buttonStyles={authConfig && authConfig.buttonStyles}
                  dropdownStyles={authConfig && authConfig.dropdownStyles}
                  container={bConfig.root}
                  attributes={attributes}
                  setAttrCallback={this.setAttributeChangeCallback}
                />
              </CacheProvider>
              <CacheProvider value={mConfig.cache}>
                <SwAuthModal rootContainer={authConfig.container} container={mConfig.root} />
              </CacheProvider>
            </>
          );
        } else {
          const config = createShadowElement({ container: this, className: 'sw-auth' });
          mountPoint = config.mountPoint;
          content = (
            <>
              <CacheProvider value={config.cache}>
                <AutButton
                  buttonStyles={authConfig && authConfig.buttonStyles}
                  dropdownStyles={authConfig && authConfig.dropdownStyles}
                  container={config.root}
                  attributes={attributes}
                  setAttrCallback={this.setAttributeChangeCallback}
                />
                <SwAuthModal container={config.root} />
              </CacheProvider>
            </>
          );
        }

        ReactDOM.render(
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={AutTheme()}>
              <Provider store={store}>
                <Router initialEntries={['/']}>
                  <Web3AutProvider>
                    <StylesProvider jss={jss}>{content}</StylesProvider>
                  </Web3AutProvider>
                </Router>
              </Provider>
            </ThemeProvider>
          </StyledEngineProvider>,
          mountPoint
        );
      }
    }
  );
}
