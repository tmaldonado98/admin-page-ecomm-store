import './EditDeleteField.css';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function EditDeleteField(){
const [rows, setRows] = useState(null);

  useEffect(()=> {
    Axios.get('http://localhost:3003/getRows')
    .then(result => setRows(result.data))
    // .then(result => console.log(result.data))
    // .then(console.log(rows))
    .catch(error => alert(error))

  }, []);


  return(
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 350,
        backgroundColor: 'lightsalmon',
      }}
    >

        {console.log(rows)}
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Size</th><th>Medium</th><th>Price</th><th>Image Source</th><th>Unique Key</th>
                    </tr>
                </thead>
                <tbody>
                {rows ? ( 
                    
                    <>
                        {rows.map(item=> (
                            <tr key={item.prodkey}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.medium}</td>
                                <td>{item.size}</td>
                                <td>{item.price}</td>
                                <td>{(item.imgsrc.data.toString('base64'))}</td>
                                <td>{item.prodkey}</td>
                            </tr>
                        ))}
                    </>)
               : (<div><p id='loading'>Loading...</p></div>)
              }
                </tbody>
            </table>



    </Paper>


  )
  
}
