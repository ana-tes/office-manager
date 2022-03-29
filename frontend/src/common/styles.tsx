import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
    infoStyle: {
      minWidth: 400,
      borderBottom: 'none'
    },
    selection: { minWidth: 'min-content', maxWidth: theme.spacing(50), minHeight: 105 },
    buttonSubmit: { minWidth: 'min-content', maxWidth: theme.spacing(50), minHeight: 105, alignItems: 'end' },
  }));