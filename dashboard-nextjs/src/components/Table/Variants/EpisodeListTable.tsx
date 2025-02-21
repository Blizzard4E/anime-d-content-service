import React, { useMemo, useState } from 'react';
import GridTable from '..';
import VideoPlayer from '@/components/VideoPlayer';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDeleteEpisode } from '@/hooks/useEpisodes';

interface Episode {
  _id: string;
  title: string;
  episodeNumber: string;
  videoUrl: string;
  animeId: string;
  createdAt: string;
  updatedAt: string;
}

interface EpisodeListTableProps {
  episodes: Episode[];
}

const EpisodeListTable: React.FC<EpisodeListTableProps> = ({ episodes }) => {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const deleteEpisode = useDeleteEpisode();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleViewEpisode = (episode: Episode) => {
    setSelectedEpisode(episode);
    setOpenVideoDialog(true);
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    try {
      await deleteEpisode.mutateAsync(episodeId);
      setSnackbar({
        open: true,
        message: 'Episode deleted successfully',
        severity: 'success',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete episode',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'episodeNumber',
        headerName: 'Episode',
        flex: 0.3,
        headerClassName: 'super-app-theme--header',
        cellClassName: 'text-left',
      },
      {
        field: 'title',
        headerName: 'Title',
        cellClassName: 'text-left',
        flex: 1.5,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        renderCell: params => (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Button
              variant='contained'
              color='primary'
              sx={{ borderRadius: '28px' }}
              onClick={() => handleViewEpisode(params.row)}>
              <VisibilityIcon />
            </Button>
            <Button
              variant='contained'
              color='error'
              sx={{ borderRadius: '28px' }}
              onClick={() => handleDeleteEpisode(params.row._id)}
              disabled={deleteEpisode.isPending}>
              <DeleteIcon />
            </Button>
          </div>
        ),
      },
    ];
  }, []);

  const rows = episodes.map(episode => ({
    id: episode._id,
    _id: episode._id,
    episodeNumber: episode.episodeNumber,
    title: episode.title,
    videoUrl: episode.videoUrl,
  }));

  return (
    <React.Fragment>
      <GridTable rows={rows} columns={columns} loading={false} />

      {/* Video Dialog */}
      <Dialog fullWidth maxWidth='lg' open={openVideoDialog} onClose={() => setOpenVideoDialog(false)}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>
              Episode {selectedEpisode?.episodeNumber}: {selectedEpisode?.title}
            </Typography>
            <IconButton onClick={() => setOpenVideoDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEpisode && (
            <VideoPlayer videoUrl={`${process.env.NEXT_PUBLIC_API_URL}/${selectedEpisode.videoUrl.replace(/\\/g, '/')}`} />
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default EpisodeListTable;
