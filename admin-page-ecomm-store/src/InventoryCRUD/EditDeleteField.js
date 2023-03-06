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
  size: '',
  medium: '',
  price: '',
  prodkey: '',
  invtype: null,
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
    console.log(theRow)
      setStateEditObj({
        name: theRow.name,
        size: theRow.size,
        medium: theRow.medium,
        price: theRow.price,
        prodkey: theRow.prodkey,
        invtype: theRow.invtype,

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

  // const handleRemove = (prodkey) => {
  //       const confirm = window.confirm('Are you sure?'); 
   
  //   if(confirm){
  //     Axios.post('http://localhost:3003/edit', prodkey) 
  //     .then(alert('Your item has been removed from the store inventory.'))
  //     .catch(error => alert(error))
  //   }
  //   setSavedStatus(!savedStatus)
  // }
  // const confirm = window.confirm('Are you sure?'); 

  function handleRemove(prodkey) {
   
    const key = prodkey;
    const confirm = window.confirm('Are you sure?'); 
    if(confirm){
      Axios.post('http://localhost:3003/deleteRow', key) 
      .then(setSavedStatus(!savedStatus))
      .then(alert('Your item has been removed from the store inventory.'))
      .catch(error => alert(error))
    }

  }

  return(
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
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
                                {/* <td>{item.size}</td>  */}
                                <td>{editingRow === item.prodkey ? (<input type='text' name='size' disabled={false} defaultValue={item.size} onChange={e => setStateEditObj({...stateEditObj, size: e.target.value})}/>) : (item.size)}</td>
                                {/* <td>{item.medium}</td> */}
                                <td>{editingRow === item.prodkey ? (<input type='text' name='medium' disabled={false} defaultValue={item.medium} onChange={e => setStateEditObj({...stateEditObj, medium: e.target.value})}/>) : (item.medium)}</td>
                                {/* <td>{item.price}</td> */}
                                <td>{editingRow === item.prodkey ? (<input type='text' inputMode='numeric' name='price' disabled={false} defaultValue={item.price} onChange={e => setStateEditObj({...stateEditObj, price: e.target.value})}/>) : (item.price)}</td>
                                <td>{item.imgsrc}</td>
                                <td>{editingRow === item.prodkey ? (<input type='text' name='prodkey' disabled={false} defaultValue={item.prodkey} onChange={e => setStateEditObj({...stateEditObj, prodkey: e.target.value})}/>) : (item.prodkey)}</td>

                                {/* <td>{item.prodkey}</td> */}
                                {/* <td>{item.invtype}</td> */}
                                <td>{editingRow === item.prodkey ? (<div>
                                    <label for="infinite">Print to order (infinite)</label>
                                    <input id='infinite'  onClick={e => setStateEditObj({...stateEditObj, invtype: 'Print to order'})} name='stripeInvData' type="radio"/>
                                    <label for="finite">Original (finite)</label>
                                    <input id='finite' onClick={e => setStateEditObj({...stateEditObj, invtype: 'Original'})} name='stripeInvData' type="radio"/>                                    
                                  </div>
                                ) : (item.invtype)}</td>
                                
{/*                                 
                                <input type='text' name='invtype' disabled={false} defaultValue={item.prodkey} onChange={e => setStateEditObj({...stateEditObj, prodkey: e.target.value})}/>



                                <label for="infinite">Print to order (infinite)</label>
                        <input id='infinite' value={inputValues.stripeInvData} onChange={sendInfinite} name='stripeInvData' type="radio" required/>
                        
                        <label for="finite">Selling original (finite)</label>
                        <input id='finite' value={inputValues.stripeInvData} onChange={sendFinite} name='stripeInvData' type="radio"/> */}

                                <td> {editingRow === item.prodkey ? (<div>
                                  <Button onClick={handleSave}>Save</Button> <Button onClick={() => handleRemove(item.prodkey)}>Remove</Button></div>)
                                 
                                : 
                                <div>{<Button onClick={()=> handleEdit(item.prodkey)}>Edit</Button>} <Button onClick={() => handleRemove(item.prodkey)}>Remove</Button></div>}
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
