import * as React from 'react';
import { Button } from '@mui/material';
import Nav from '../Nav';
import InsertField from '../InventoryCRUD/InsertField';
import EditDeleteField from '../InventoryCRUD/EditDeleteField';
import './ProdInventory.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SimpleAccordion() {
  return (
    <div>
      <Nav/>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Insert Item Menu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Insert items into 'inventory' table in MySQL Database 'veacollections'. <br/>
            Follow all instructions; enter information for all input fields.
          </Typography>
        </AccordionDetails>
        <InsertField/>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>View, Edit or Delete Items From Inventory</Typography>
        </AccordionSummary>
        {/* <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails> */}
        <EditDeleteField/>
      </Accordion>


      {/* <Accordion disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion> */}
    </div>
  );
}