import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { RootStoreProvider } from '../stores/RootStore';
import Layout from '../components/Layout';
import { InputWrapperStyles } from '../components/shared/InputWrapper';
import { useRouter } from 'next/router';

import 'react-datepicker/dist/react-datepicker.css';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      'html, body': {
        lineHeight: 'normal',
      },
      body: {
        '.clear': {
          clear: 'both',
        },
        '.ProseMirror': {
          color: 'gray.700',
          // @see https://github.com/jesster2k10/guava-cards/blob/5d5c283eb720bf503258f4e17bce3865d35fd8d3/packages/website/src/bundles/editor/ContentEditor.tsx#L86
          'ul[data-type="taskList"]': {
            listStyle: 'none',
            padding: 0,

            p: {
              margin: 0,
            },

            li: {
              display: 'flex',

              '> label': {
                flex: '0 0 auto',
                marginRight: '0.5rem',
                userSelect: 'none',
                '> input': {
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'gray.200',
                  width: 4,
                  height: 4,
                },
              },

              '> div': {
                flex: '1 1 auto',
              },
            },
          },
          'p.is-editor-empty:first-child::before': {
            content: 'attr(data-placeholder)',
            color: 'gray.500',
            float: 'left',
            pointerEvents: 'none',
            height: 0,
          },
          '&:focus': {
            outline: 'none',
          },
          h1: {
            fontSize: '1.375rem',
            mt: 4,
          },
          h2: {
            fontSize: '1.125rem',
            mt: 4,
          },
          h3: {
            fontSize: '1rem',
            mt: 4,
          },
          p: {
            fontSize: '1rem',
          },
          'h1, h2, h3, h4,  h5, h6 ': {
            fontWeight: '700',
          },
          'ul, ol': {
            padding: '0 1.2rem',
          },
          ol: {
            listStyle: 'decimal',
            ol: {
              listStyle: 'lower-alpha',
              ol: {
                listStyle: 'lower-roman',
                ol: {
                  listStyle: 'decimal',
                  ol: {
                    listStyle: 'lower-alpha',
                    ol: {
                      listStyle: 'lower-roman',
                    },
                  },
                },
              },
            },
          },
          code: {
            bg: 'rgba(#616161, 0.1)',
            color: '#616161',
          },
          pre: {
            fontFamily: "JetBrainsMono, 'Courier New', Courier, monospace",
            background: mode('gray.900', 'blue.200')(props),
            color: mode('white', 'gray.900')(props),
            padding: '0.75rem 1rem',
            rounded: 'lg',
            whiteSpace: 'pre-wrap',
            code: {
              color: 'inherit',
              p: 0,
              background: 'none',
              fontSize: '0.8rem',
            },

            '.hljs-comment, .hljs-quote': {
              color: '#616161',
            },

            '.hljs-variable, .hljs-template-variable,  .hljs-attribute, .hljs-tag, .hljs-name, .hljs-regexp, .hljs-link, .hljs-name, .hljs-selector-id, .hljs-selector-class':
              {
                color: '#F98181',
              },

            '.hljs-number,  .hljs-meta, .hljs-built_in, .hljs-builtin-name, .hljs-literal,  .hljs-type, .hljs-params':
              {
                color: '#FBBC88',
              },

            '.hljs-string, .hljs-symbol, .hljs-bullet': {
              color: '#B9F18D',
            },

            '.hljs-title, .hljs-section': {
              color: '#FAF594',
            },

            '.hljs-keyword, .hljs-selector-tag': {
              color: '#70CFF8',
            },

            '.hljs-emphasis': {
              fontStyle: 'italic',
            },

            '.hljs-strong': {
              fontWeight: 700,
            },
          },
          blockquote: {
            pl: 4,
            borderLeft: '2px solid rgba(13, 13, 13, 0.1)',
          },
          'span[data-spoiler]': {
            bg: mode('gray.900', 'gray.100')(props),
            _hover: {
              bg: 'transparent',
            },
            // @apply dark:bg-gray-100 bg-gray-900 dark:hover:bg-transparent hover:bg-transparent;
          },
          img: {
            maxW: 'full',
            h: 'auto',
          },
          mark: {
            bg: '#FAF594',
          },
          hr: {
            border: 'none',
            borderTop: '2px solid rgba(#0D0D0D, 0.1)',
          },
        },
        '.react-datepicker-wrapper': {
          width: 'auto',

          '.react-datepicker-ignore-onclickoutside': {
            paddingLeft: 1,
            outline: 'none',

            _focus: {
              borderRadius: 4,
              borderWidth: 2,
              borderColor: 'blue.300',
              borderStyle: 'solid',
            }
          },
          '.react-datepicker__input-container': {
            maxWidth: '100px',
            width: 'auto',
          },
          '.react-datepicker__input-container input': {
            width: '100%',
          }
        },
        '.react-datepicker': {
          fontFamily: 'var(--chakra-fonts-body)',
          fontSize: 'sm',
          borderRadius: 16,
          borderColor: 'gray.200',

          '.react-datepicker__triangle': {
            display: 'none',
          },
          '.react-datepicker__header': {
            background: 'white',
            border: 0,
          },
          '.react-datepicker__day-names': {
            margin: 0,
          },
          '.react-datepicker__day-name': {
            fontWeight: 'semibold',
            fontSize: 'xs',
            color: 'gray.400',
            lineHeight: 4,
            width: 10,
            margin: 0,
          },
          '.react-datepicker__month-container': {
            pl: 5,
            pr: 5,
            pt: 4,
            pb: 6,
          },
          '.react-datepicker__day': {
            width: 8,
            height: 8,
            margin: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            fontWeight: 'medium',
            border: 0,
            outline: 'none',

            _hover: {
              bg: 'gray.100',
            }
          },
          '.react-datepicker__day--today': {
            bg: 'purple.300',
            color: 'white',

            _hover: {
              bg: 'purple.400',
            }
          },
          '.react-datepicker__day--selected': {
            bg: 'blue.300',
            color: 'white',

            _hover: {
              bg: 'blue.400',
            }
          },
          '.react-datepicker__day--outside-month': {
            color: 'gray.400'
          },
          '.react-datepicker__day--keyboard-selected': {
            bg: 'gray.100',
          },
          '.react-datepicker__day--keyboard-selected.react-datepicker__day--selected': {
            bg: 'blue.400',
          },
          '.react-datepicker__day--keyboard-selected.react-datepicker__day--today': {
            bg: 'purple.400',
          }
        },
        '.react-datepicker-popper': {
          zIndex: 'var(--chakra-zIndices-popover)',
        },
      },
    }),
  },
  colors: {
    blue: {
      25: '#F4FBFF',
      75: '#D6F1FF',
    },
    gray: {
      75: '#F4F8FB',
    },
    orange: {
      75: '#FFF5E0',
    },
    yellow: {
      75: '#FFFFD1',
    },
    green: {
      75: '#DBFFE5',
    },
    teal: {
      75: '#D6FFF7',
    },
    cyan: {
      75: '#DAFBFB',
    },
    purple: {
      75: '#F2E5FF',
    },
    pink: {
      75: '#FFEBEF',
    },
  },
  components: {
    ...InputWrapperStyles,
    Text: {
      baseStyle: {
        lineHeight: 6,
      },
    },
    Radio: {
      baseStyle: {
        label: {
          flex: 1,
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          borderWidth: '0',
          overflow: 'hidden',
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          transitionProperty: 'common',
          transitionDuration: 'normal',
        },
      },
      variants: {
        indeterminateUnfilled: {
          control: {
            transitionProperty: 'common',
            transitionDuration: 'normal',
            bg: 'white',
            _indeterminate: {
              bg: 'white',
              borderColor: 'gray.200',
              color: 'gray.200',
            },
          },
        },
      },
      sizes: {
        xl: {
          control: {
            w: 6,
            h: 6,
          },
          label: {
            fontSize: 'lg',
          },
          icon: {
            fontSize: '2xs',
          },
        },
      },
    },
    Drawer: {
      variants: {
        aside: {
          dialog: {
            pointerEvents: 'auto',
          },
          dialogContainer: {
            pointerEvents: 'none',
          },
        },
      },
    },
    Popover: {
      baseStyle: {
        popper: {
          zIndex: 'popover',
          _focus: { boxShadow: 'none', outline: 'none' },
          _focusVisible: { boxShadow: 'none', outline: 'none' },
        },
        content: {
          _focus: { boxShadow: 'none', outline: 'none' },
          _focusVisible: { boxShadow: 'none', outline: 'none' },
        },
      },
      variants: {
        relative: {
          popper: {
            position: 'relative!important',
          },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        borderRadius: 'md',
        '.chakra-tooltip__arrow': {
          borderBottomLeftRadius: '2px',
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ChakraProvider theme={theme}>
      <RootStoreProvider router={router}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RootStoreProvider>
    </ChakraProvider>
  );
}
