import { MemoryRouter as Router } from 'react-router-dom';
import { CacheProvider, CSSObject, ThemeProvider } from '@emotion/react';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import Theme from './theme/theme';
import store from './store/store';
import SwAuthModal, { AutButton } from './Aut';
import { AttributeCallbackFn, SwAuthConfig } from './types/d-aut-config';
import { AttributeNames, createShadowElement, extractAttributes, isElement } from './utils/utils';
import Web3AutProvider from './services/ProviderFactory/web3.aut.provider';
import { createRoot } from 'react-dom/client';
import { fonts } from './assets/fonts/Fractul/fontsBase64';
import { env } from './services/web3/env';
import { apolloClient } from './store/graphql';

function safeDecorator(fn) {
  // eslint-disable-next-line func-names
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      if (error instanceof DOMException && error.message.includes('has already been used with this registry')) {
        return false;
      }
      throw error;
    }
  };
}

customElements.define = safeDecorator(customElements.define);

export function Init(authConfig: SwAuthConfig<CSSObject> = null) {
  const TAG_NAME = 'd-aut';

  const style = document.createElement('style');
  style.textContent = fonts;

  if (!document.getElementById('dAutFonts')) {
    const head = document.head || document.getElementsByTagName('head')[0];
    style.id = 'dAutFonts';
    style.type = 'text/css';
    head.appendChild(style);
  }

  if (!customElements.get(TAG_NAME)) {
    customElements.define(
      TAG_NAME,
      class extends HTMLElement {
        public childAttrCalback: AttributeCallbackFn;

        static get observedAttributes() {
          // Add all tracked attributes to this array
          return [
            AttributeNames.hideButton,
            AttributeNames.novaAddress,
            AttributeNames.menuItems,
            AttributeNames.network,
            AttributeNames.flowConfig,
            AttributeNames.allowedRoleId,
          ];
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

          if (attributes.useDev) {
            env.REACT_APP_API_URL = env.REACT_APP_API_URL_DEV;
          }

          let content: any = null;
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
            const mConfig = createShadowElement({ container: authConfig.container, className: 'aut-modal' });

            // mConfig.shadowRoot.insertB(style);
            const bConfig = createShadowElement({ container: this, className: 'aut-button' });

            // bConfig.shadowRoot.appendChild(style);
            mountPoint = mConfig.mountPoint;
            content = (
              <>
                <CacheProvider value={bConfig.cache}>
                  <AutButton
                    config={authConfig && authConfig.config}
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
            const config = createShadowElement({ container: this, className: 'aut' });
            // config.shadowRoot.appendChild(style);
            mountPoint = config.mountPoint;
            content = (
              <>
                <CacheProvider value={config.cache}>
                  <AutButton
                    config={authConfig && authConfig.config}
                    container={config.root}
                    attributes={attributes}
                    setAttrCallback={this.setAttributeChangeCallback}
                  />
                  <SwAuthModal container={config.root} />
                </CacheProvider>
              </>
            );
          }

          const root = createRoot(mountPoint);

          root.render(
            <StyledEngineProvider injectFirst>
              <ApolloProvider client={apolloClient}>
                <ThemeProvider theme={Theme}>
                  <Provider store={store}>
                    <Router initialEntries={['/']}>
                      <Web3AutProvider>
                        <StylesProvider jss={jss}>{content}</StylesProvider>
                      </Web3AutProvider>
                    </Router>
                  </Provider>
                </ThemeProvider>
              </ApolloProvider>
            </StyledEngineProvider>
          );
        }
      }
    );
  }
}
