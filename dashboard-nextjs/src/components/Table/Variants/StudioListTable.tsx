// components/StudioListTable.tsx
import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import GridTable from '..';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GridColDef } from '@mui/x-data-grid';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import StudioForm from '@/components/Form/StudioForm';
import CloseIcon from '@mui/icons-material/Close';
import { Studio, studioService } from '@/services/studio-service';
import { useDeleteStudio } from '@/hooks/useStudios';
import Snackbar from '@/components/Snackbar';

interface ActionCellProps {
  row: Studio;
  onEdit: (studio: Studio) => void;
  onDelete: (studio: Studio) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ row, onEdit, onDelete }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Button variant='contained' color='primary' sx={{ borderRadius: '28px' }} onClick={() => onEdit(row)}>
        <EditIcon />
      </Button>
      <Button variant='contained' color='error' sx={{ borderRadius: '28px' }} onClick={() => onDelete(row)}>
        <DeleteIcon />
      </Button>
    </div>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const StudioListTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['studios'],
    queryFn: studioService.getAll,
    select: response => response.data || [],
  });

  const deleteStudioMutation = useDeleteStudio();

  const handleOpenDialog = (mode: 'add' | 'edit', studio?: Studio) => {
    setDialogMode(mode);
    setSelectedStudio(studio || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudio(null);
    setDialogMode('add');
  };

  const handleEdit = (studio: Studio) => {
    handleOpenDialog('edit', studio);
  };

  const handleOpenDeleteDialog = (studio: Studio) => {
    setSelectedStudio(studio);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedStudio(null);
  };

  const showAlert = (message: string, severity: AlertState['severity']) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const handleDelete = async () => {
    if (!selectedStudio) return;

    deleteStudioMutation.mutate(selectedStudio._id, {
      onSuccess: () => {
        showAlert('Studio deleted successfully!', 'success');
        handleCloseDeleteDialog();
      },
      onError: error => {
        showAlert(error instanceof Error ? error.message : 'Failed to delete studio', 'error');
      },
    });
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'title',
        headerName: 'Name',
        cellClassName: 'text-left',
        flex: 1.5,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        headerClassName: 'super-app-theme--header',
        renderCell: params => {
          return <ActionCell row={params.row} onEdit={handleEdit} onDelete={handleOpenDeleteDialog} />;
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.map(studio => ({
      ...studio,
      id: studio._id,
    }));
  }, [data]);

  return (
    <React.Fragment>
      <Button
        variant='contained'
        color='success'
        startIcon={<AddCircleOutlineOutlinedIcon />}
        onClick={() => handleOpenDialog('add')}
        sx={{
          borderRadius: '16px',
          fontWeight: 'bold',
          letterSpacing: 1,
          transition: 'all 0.2s',
          '&:hover': {
            background: 'rgb(25,118,210,1)',
            color: 'white',
            letterSpacing: 3,
          },
        }}>
        Add Studio
      </Button>

      <GridTable rows={rows} columns={columns} loading={isLoading} getRowId={(row: Studio): string => row._id} />

      {/* Form Dialog */}
      <Dialog fullWidth maxWidth='sm' open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>{dialogMode === 'add' ? 'Add New Studio' : 'Edit Studio'}</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <StudioForm handleToggleDialog={handleCloseDialog} initialData={selectedStudio || undefined} mode={dialogMode} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'>
        <DialogTitle id='delete-dialog-title'>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Are you sure you want to delete the studio &quot;{selectedStudio?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color='primary' disabled={deleteStudioMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='error' variant='contained' disabled={deleteStudioMutation.isPending}>
            {deleteStudioMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar open={alert.open} message={alert.message} severity={alert.severity} onClose={handleCloseAlert} />
    </React.Fragment>
  );
};

export default StudioListTable;
