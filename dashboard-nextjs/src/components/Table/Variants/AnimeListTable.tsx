/* eslint-disable @typescript-eslint/no-explicit-any */
import GridTable from '@/components/Table';
import { useAnimes, useDeleteAnime } from '@/hooks/useAnimes';
import { useMemo, useState } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import AnimeDetail from '@/components/AnimeDetail';

const AnimeListTable = () => {
  const [openAnimeDetailDialog, setOpenAnimeDetailDialog] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const { data, isLoading } = useAnimes();
  const deleteAnime = useDeleteAnime();

  // Format data properly for the table
  const rows =
    data?.data?.map((anime, index) => ({
      id: index,
      _id: anime._id,
      title: anime.title,
      posterUrl: anime.posterUrl,
      coverUrl: anime.coverUrl,
      logoUrl: anime.logoUrl,
      genres: anime.genres || [],
      studio: anime.studio || { title: 'Unknown' },
      description: anime.description,
      releaseDate: anime.releaseDate,
      status: anime.status,
      trailerUrl: anime.trailerUrl,
      episodes: anime.episodes || [],
      createdAt: anime.createdAt,
      updatedAt: anime.updatedAt,
    })) || [];

  const handleViewAnime = (anime: any) => {
    setSelectedAnime(anime);
    setOpenAnimeDetailDialog(true);
  };

  const handleDeleteAnime = async (id: string) => {
    try {
      await deleteAnime.mutateAsync(id);
      setSnackbarMessage('Anime deleted successfully!');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbarMessage('Failed to delete anime.');
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', flex: 0.5 },
      { field: 'title', headerName: 'Title', flex: 1 },
      { field: 'status', headerName: 'Status', flex: 1 },
      {
        field: 'action',
        headerName: 'Actions',
        flex: 1,
        renderCell: params => (
          <Box display='flex' justifyContent='center' alignItems='center' gap={1} sx={{ height: '100%' }}>
            <Button variant='contained' color='info' onClick={() => handleViewAnime(params.row)}>
              <VisibilityIcon />
            </Button>
            <Button variant='contained' color='error' onClick={() => handleDeleteAnime(params.row._id)}>
              <DeleteIcon />
            </Button>
          </Box>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <GridTable rows={rows} columns={columns} loading={isLoading} />

      {/* Anime Detail Dialog */}
      <Dialog fullWidth maxWidth='xl' open={openAnimeDetailDialog} onClose={() => setOpenAnimeDetailDialog(false)}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>Anime Details</Typography>
            <IconButton onClick={() => setOpenAnimeDetailDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAnime ? <AnimeDetail anime={selectedAnime} /> : <Typography>No details available.</Typography>}
        </DialogContent>
      </Dialog>

      {/* Snackbar for success/failure messages */}
      <Snackbar open={!!snackbarMessage} autoHideDuration={3000} onClose={() => setSnackbarMessage(null)}>
        <Alert severity='success'>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
};

export default AnimeListTable;
