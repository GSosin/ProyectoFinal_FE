'use client';

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function DynamicEditor({ onChange, initialContent = '' }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  // Actualizar el contenido cuando cambie initialContent
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // Asegurarse de limpiar el editor al desmontar
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        borderRadius: 1,
        p: 2,
        minHeight: 150,
        mb: 3,
        background: 'white',
        '& .ProseMirror': {
          outline: 'none',
          minHeight: 120,
          padding: '8px',
        }
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}