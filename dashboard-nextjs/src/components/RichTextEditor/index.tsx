import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Button,
  ButtonGroup,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import { ChangeEvent, useState, useEffect } from 'react';
import ImageIcon from '@mui/icons-material/Image';

interface MenuBarProps {
  editor: Editor | null;
}

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ open, onClose, onInsert }) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = () => {
    if (imageUrl) {
      onInsert(imageUrl);
      setImageUrl('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Insert Image</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Image URL'
          type='url'
          fullWidth
          variant='outlined'
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'error',
  });

  if (!editor) {
    return null;
  }

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const addImage = (url: string) => {
    if (url) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: { src: url },
        })
        .run();
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setAlert({
          open: true,
          message: 'File is too large. Maximum size is 5MB',
          severity: 'error',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setAlert({
          open: true,
          message: 'Please upload an image file',
          severity: 'error',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'image',
              attrs: { src: event.target.result.toString() },
            })
            .run();
          setAlert({
            open: true,
            message: 'Image uploaded successfully',
            severity: 'success',
          });
        }
      };
      reader.onerror = () => {
        setAlert({
          open: true,
          message: 'Error reading file',
          severity: 'error',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <ButtonGroup variant='outlined' size='small'>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          sx={{
            backgroundColor: editor.isActive('bold') ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
          }}>
          <FormatBoldIcon />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          sx={{
            backgroundColor: editor.isActive('italic') ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
          }}>
          <FormatItalicIcon />
        </Button>
        <Button component='label'>
          <ImageIcon />
          <input type='file' hidden accept='image/*' onChange={handleImageUpload} />
        </Button>
        <Button onClick={() => setImageDialogOpen(true)}>
          <ImageIcon /> URL
        </Button>
      </ButtonGroup>

      <ImageDialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} onInsert={addImage} />

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
          draggable: 'true',
        },
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: 'Write your content here...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when value prop change
  // useEffect(() => {
  //   if (editor && value !== editor.getHTML()) {
  //     editor.commands.setContent(value);
  //   }
  // }, [value, editor]);

  return (
    <Paper elevation={0}>
      <MenuBar editor={editor} />
      <Box
        sx={{
          p: 0,
          border: '1px solid #ddd',
          borderRadius: 1,
          minHeight: 300,
          '& .ProseMirror': {
            outline: 'none',
            minHeight: '300px',
            padding: '1rem',
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: 1,
              '&.ProseMirror-selectednode': {
                outline: '2px solid #000',
              },
            },
            '& p': {
              margin: '1em 0',
            },
          },
          '& .ProseMirror p.is-editor-empty:first-child::before': {
            color: '#adb5bd',
            content: 'attr(data-placeholder)',
            float: 'left',
            height: 0,
            pointerEvents: 'none',
          },
        }}>
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default RichTextEditor;
