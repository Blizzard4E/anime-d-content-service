'use client';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAnimeSchema } from '@/validation/anime.schema';
import CoolButton from '@/components/CustomButton';
import CoolSelect from '@/components/CustomButton/CoolSelectInput';
import FileUpload from '@/components/UploadButton';
import { useGenres } from '@/hooks/useGenres';
import { useStudios } from '@/hooks/useStudios';
import { useCreateAnime } from '@/hooks/useAnimes';
import { Box, Button, Typography, TextField, Snackbar, Alert } from '@mui/material';

interface CreateAnimeInput {
  title: string;
  description: string;
  genres: string[];
  studio: string;
  releaseDate: string;
  status: 'ongoing' | 'completed';
}

interface AnimeFiles {
  poster: File | null;
  cover: File | null;
  logo: File | null;
  trailer: File | null;
}

const AnimeForm = ({ onClose }: { onClose: () => void }) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: genresResponse, isLoading: isLoadingGenres } = useGenres();
  const { data: studiosResponse, isLoading: isLoadingStudios } = useStudios();
  const createAnime = useCreateAnime();

  const [files, setFiles] = useState<AnimeFiles>({
    poster: null,
    cover: null,
    logo: null,
    trailer: null,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateAnimeInput>({
    resolver: zodResolver(createAnimeSchema),
    defaultValues: {
      title: '',
      description: '',
      genres: [],
      studio: '',
      releaseDate: new Date().toISOString().split('T')[0],
      status: 'ongoing',
    },
  });

  const onSubmit = async (data: CreateAnimeInput) => {
    try {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Add upload progress tracking
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          // Update progress state
          setUploadProgress(percentComplete);
        }
      };

      // Append data and files
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'genres') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      formData.append('poster', files.poster!);
      formData.append('cover', files.cover!);
      formData.append('logo', files.logo!);
      formData.append('trailer', files.trailer!);

      await createAnime.mutateAsync({
        data,
        files: {
          poster: files.poster!,
          cover: files.cover!,
          logo: files.logo!,
          trailer: files.trailer!,
        },
      });

      setSuccessMessage('Anime created successfully!');
      onClose(); // Close the dialog/modal after success
    } catch (error) {
      console.error('Failed to create anime:', error);
      setError('root', {
        message: error instanceof Error ? error.message : 'Failed to create anime',
      });
    }
  };

  const handleFileChange = (type: keyof AnimeFiles) => (file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [type]: file,
    }));
  };

  const genreOptions =
    genresResponse?.data
      ?.map(genre => ({
        value: genre._id,
        label: genre.title || genre._id, // Provide a fallback for undefined name
      }))
      .filter((option): option is { value: string; label: string } => Boolean(option.value && option.label)) ?? [];

  const studioOptions =
    studiosResponse?.data
      ?.map(studio => ({
        value: studio._id,
        label: studio.title || studio._id, // Provide a fallback
      }))
      .filter((option): option is { value: string; label: string } => Boolean(option.value && option.label)) ?? [];

  if (isLoadingGenres || isLoadingStudios) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Add New Anime
      </Typography>

      {errors.root && (
        <Typography color='error' sx={{ mb: 2 }}>
          {errors.root.message}
        </Typography>
      )}

      <Controller
        name='title'
        control={control}
        render={({ field }) => (
          <CoolButton
            {...field}
            required
            label='Title'
            fullWidth
            variant='filled'
            type='text'
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name='genres'
        control={control}
        render={({ field }) => (
          <CoolSelect
            {...field}
            required
            label='Genres'
            multiple
            value={field.value}
            onChange={(e: SelectChangeEvent<unknown>) => {
              field.onChange(e.target.value as string[]);
            }}
            options={genreOptions}
            error={!!errors.genres}
            helperText={errors.genres?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name='studio'
        control={control}
        render={({ field }) => (
          <CoolSelect
            {...field}
            required
            id='select-studio'
            label='Studio'
            value={field.value}
            onChange={(e: SelectChangeEvent<unknown>) => {
              field.onChange(e.target.value as string);
            }}
            options={studioOptions}
            error={!!errors.studio}
            helperText={errors.studio?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name='status'
        control={control}
        render={({ field }) => (
          <CoolSelect
            {...field}
            required
            id='select-status'
            label='Status'
            value={field.value}
            onChange={(e: SelectChangeEvent<unknown>) => {
              field.onChange(e.target.value as string);
            }}
            options={[
              { value: 'ongoing', label: 'On Going' },
              { value: 'completed', label: 'Completed' },
            ]}
            error={!!errors.status}
            helperText={errors.status?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name='releaseDate'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type='date'
            label='Release Date'
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.releaseDate}
            helperText={errors.releaseDate?.message}
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name='description'
        control={control}
        render={({ field }) => (
          <Box sx={{ mb: 3 }}>
            <Typography variant='body1' sx={{ mb: 1 }}>
              Description
            </Typography>
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              variant='outlined'
              placeholder='Enter anime description...'
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>
        )}
      />

      <Typography variant='h6' sx={{ mb: 2 }}>
        Media Files
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant='body1' sx={{ mb: 1 }}>
          Cover Image (Required)
        </Typography>
        <Box sx={{ p: 3, border: `2px dashed ${files.cover ? 'green' : 'lightblue'}`, borderRadius: '16px' }}>
          <FileUpload maxSize={5 * 1024 * 1024} accept='image/jpeg,image/png' onFilesSelected={handleFileChange('cover')} />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant='body1' sx={{ mb: 1 }}>
          Poster Image
        </Typography>
        <Box sx={{ p: 3, border: `2px dashed lightblue`, borderRadius: '16px' }}>
          <FileUpload maxSize={5 * 1024 * 1024} onFilesSelected={handleFileChange('poster')} />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant='body1' sx={{ mb: 1 }}>
          Logo Image
        </Typography>
        <Box sx={{ p: 3, border: `2px dashed lightblue`, borderRadius: '16px' }}>
          <FileUpload maxSize={5 * 1024 * 1024} onFilesSelected={handleFileChange('logo')} />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant='body1' sx={{ mb: 1 }}>
          Trailer Video
        </Typography>
        <Box sx={{ p: 3, border: `2px dashed lightblue`, borderRadius: '16px' }}>
          <FileUpload maxSize={500 * 1024 * 1024} accept='video/mp4' onFilesSelected={handleFileChange('trailer')} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='contained' type='submit' disabled={createAnime.isPending}>
          {createAnime.isPending ? `Adding...${uploadProgress}%` : 'Add Anime'}
        </Button>
      </Box>

      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(null)}>
        <Alert severity='success'>{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AnimeForm;
