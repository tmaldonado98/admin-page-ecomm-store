import { Button } from '@mui/material';
import './InsertField.css';

function onlyNumbers(e){
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        return false;
    }
    // return true;
}

export default function InsertField() {
    
    function insert(){
        console.log('inserted')
    }

    function noInsert(){
        console.log('empty inputs')
    }
    const input = document.querySelectorAll('input');
    return (
        <>
        <fieldset>
            <legend>Add Product To Inventory And Present On Live Site</legend>
            <div id='container'>
                
                <label for="name">Item Name (no "" double nor '' single quotes)</label>
                <input required placeholder='Item Name' name='name' type="text"/>
                
                <label for="size">Size (format as: number" x number")</label>
                <input required placeholder='ex: 30" x 30"' name='size' type="text"/>
                
                <label for="medium">Medium</label>
                <input required name='medium' type="text"/>
                
                <label for="price">Price (numbers only)</label>
                <input required placeholder='ex: 20' name='price' inputMode='numeric' pattern="\d*" onKeyDown={onlyNumbers} />
                
                <label for="img">Image File</label>
                <input required name='img' type="file" multiple="false" accept="image/*" />
                
                {/* <div id='img-preview'><p>Fetch image for preview</p></div> */}
                
                <label for="prodkey">Write a product key in all lowercase or all uppercase. <br/> Recommended to assign one alphabetic integer per inventory item.<br/> For example: "one" for item 1, "two" for item 2, "three" for item 3, etc. </label>
                <input required name='prodkey' type="text"/>
                <br/>
                {/* <label for='submit'>Add Product To Inventory And Present On Live Site</label> */}
                <Button variant='contained' name='submit'  onClick={insert}>Add Product</Button>
                
            </div>{/* ? input.values.length > 0 : noInsert */}
        </fieldset>
        </>
    )
}