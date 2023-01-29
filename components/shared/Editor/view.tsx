import { observer } from 'mobx-react-lite';
import { Box, ButtonGroup, chakra, IconButton, Text, Input } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useEditorStore } from './store';
import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import { faCode, faLink } from '@fortawesome/pro-regular-svg-icons';
import styles from './Editor.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EditorView = observer(function EditorView() {
  const store = useEditorStore();
  const editor = useEditor({
    extensions: store.extensions,
    content: store.content,
    autofocus: !!store.isFocused,
    onFocus: store.handleFocus,
    onBlur: store.handleBlur,
  });

  useEffect(() => store.setEditor(editor), [store, editor]);

  return (
    <chakra.div
      className={styles.root}
      onClick={store.handleClick}
      bg='white'
      cursor='text'
    >
      {editor && (
        <BubbleMenu
            editor={editor}
            tippyOptions={{
              duration: 100,
              placement: 'top-start',
              onClickOutside: store.closeLinkForm,
              onHidden: store.closeLinkForm,
            }}
        >
          <Box
            boxShadow='lg'
            overflow='hidden'
            w='auto'
            borderRadius='md'
            bg='white'
          >
            {store.isLinkFormOpened ? (
                <>
                  <Input
                      value={store.linkValue}
                      placeholder='URL'
                      onKeyDown={store.handleLinkInputKeyDown}
                      autoFocus
                      onInput={store.updateLinkValue}
                  />
                </>
            ) : (
                <ButtonGroup w='100%' isAttached>
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('bold') ? 'blue' : 'gray'}
                      aria-label='Bold'
                      icon={<Text>B</Text>}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('italic') ? 'blue' : 'gray'}
                      aria-label='Italic'
                      icon={<Text>I</Text>}
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('underline') ? 'blue' : 'gray'}
                      aria-label='Underline'
                      icon={<Text>U</Text>}
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('strike') ? 'blue' : 'gray'}
                      aria-label='Strike'
                      icon={<Text>S</Text>}
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('highlight') ? 'blue' : 'gray'}
                      aria-label='Highlight'
                      icon={<Text>H</Text>}
                      onClick={() => editor.chain().focus().toggleHighlight().run()}
                  />
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('code') ? 'blue' : 'gray'}
                      aria-label='Code'
                      onClick={() => editor.chain().focus().toggleCode().run()}
                  >
                    <FontAwesomeIcon
                        fontSize={14}
                        icon={faCode}
                        fixedWidth
                    />
                  </IconButton>
                  <IconButton
                      size='sm'
                      variant='ghost'
                      colorScheme={editor.isActive('link') ? 'blue' : 'gray'}
                      aria-label='Link'
                      onClick={store.openLinkForm}
                  >
                    <FontAwesomeIcon
                        fontSize={14}
                        icon={faLink}
                        fixedWidth
                    />
                  </IconButton>
                </ButtonGroup>
            )}
          </Box>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </chakra.div>
  );
});
