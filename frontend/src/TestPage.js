import * as React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};
function TestPage() {

  return (
    <List sx={style} component="nav" aria-label="mailbox folders">
      <ListItem >
        <ListItemText primary="Inbox" />
        <ListItemText primary="Inbox" />
      </ListItem>
      
      <Divider />
      <ListItem button divider>
        <ListItemText primary="Drafts" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Trash" />
      </ListItem>
      <Divider light />
      <ListItem button>
        <ListItemText primary="Spam" />
      </ListItem>
    </List>
  );
}

export default TestPage
