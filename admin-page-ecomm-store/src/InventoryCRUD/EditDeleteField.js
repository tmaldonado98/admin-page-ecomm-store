import './EditDeleteField.css';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button } from '@mui/material';

export default function EditDeleteField(){
const [rows, setRows] = useState(null);

const [editable, setEditable] = useState(true);

const [editingRow, setEditingRow] = useState(null);

const [stateEditObj, setStateEditObj] = useState({
  name: '',
  prodkey: '',
});

const [savedStatus, setSavedStatus] = useState(false)

  useEffect(()=> {
    Axios.get('http://localhost:3003/getRows')
    .then(result => setRows(result.data))
    // .then(result => console.log(result.data))
    // .then(console.log(rows))
    .catch(error => alert(error))

  }, [savedStatus]);

  function handleEdit (prodkey){
    setEditingRow(prodkey)

    // console.log(prodkey)
    const theRow = rows.find(curIt => curIt.prodkey === prodkey)
    // console.log(theRow)
      setStateEditObj({
        name: theRow.name,
        prodkey: theRow.prodkey,
      })
    

    // console.log(stateEditObj)

  }

  function handleSave (){

    let editObj = stateEditObj;

    console.log(editObj)

    Axios.post('http://localhost:3003/edit', editObj) 
    .then(setEditingRow(null))
    .then(alert('Your modifications have been saved.'))

    setSavedStatus(!savedStatus)
  }

  function handleRemove() {
    const confirm = window.confirm('Are you sure?')
    
    //define sql statement
    // define db query
    
    if(confirm){
      //db query
      alert('Your item has been removed from the store inventory.')
    }
  }

  return(
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 350,
        backgroundColor: 'darkred',
      }}
    >

        {console.log(rows)}
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Size</th><th>Medium</th><th>Price</th><th>Image Source</th><th>Unique Key</th><th>Inv. Type</th><th>Edit/Delete</th>
                    </tr>
                </thead>
                <tbody>
                {rows ? ( 
                    
                    <>
                        {rows.map(item=> (
                            <tr key={item.prodkey}>
                                <td>{item.id}</td>
                                <td>{editingRow === item.prodkey ? (<input type='text' name='name' disabled={false} defaultValue={item.name} onChange={e => setStateEditObj({...stateEditObj, name: e.target.value})}/>) : (item.name)}</td>
                                <td>{item.size}</td>
                                <td>{item.medium}</td>
                                <td>{item.price}</td>
                                <td>{item.imgsrc}</td>
                                <td>{editingRow === item.prodkey ? (<input type='text' name='prodkey' disabled={false} defaultValue={item.prodkey} onChange={e => setStateEditObj({...stateEditObj, prodkey: e.target.value})}/>) : (item.prodkey)}</td>

                                {/* <td>{item.prodkey}</td> */}
                                <td>{item.invtype}</td>
                                <td> {editingRow === item.prodkey ? (<div>
                                  <Button onClick={handleSave}>Save</Button> <Button onClick={handleRemove}>Remove</Button></div>)
                                 
                                : 
                                <div>{<Button onClick={()=> handleEdit(item.prodkey)}>Edit</Button>} <Button onClick={handleRemove}>Remove</Button></div>}
                                </td>
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
