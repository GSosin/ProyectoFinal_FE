'use client';

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function DynamicEditor({ onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

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
        p: 1,
        minHeight: 150,
        mb: 2,
        background: 'white',
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}