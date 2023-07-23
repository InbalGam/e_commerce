import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import {loadCategoryImage, insertNewCategory} from '../Api';
import { useNavigate } from 'react-router-dom';
import {loadCategories} from '../store/categorySlice';
import { useDispatch } from 'react-redux';


function CategoryAddUpdate(props) {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImg, setCategoryImg] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleCategoryNameChange(e) {
        setCategoryName(e.target.value);
    };

    async function imageLoad(e) {
        e.preventDefault();
        setCategoryImg(e.target.files[0]);
    };

    async function submitNewCategory(e) {
        e.preventDefault();
        let imgId;
        const data = new FormData();
        data.append('image', categoryImg );
        try {
            if (categoryImg) {
                const imgResult = await loadCategoryImage(data);
                const jsonData = await imgResult.json();
                imgId = jsonData.id;
            } else {
                imgId = null;
            }
            const result = await insertNewCategory(categoryName, imgId);
            if (result.status === 200) {
                dispatch(loadCategories());
            } else if (result.status === 401){
                navigate('/login');
            }
        } catch (e) {
            navigate('/error');
        }
    };


    return (
        <form>
            <input id='categoryName' type='text' name='categoryName' value={categoryName} placeholder={'Enter category name'} onChange={handleCategoryNameChange} />
            <label htmlFor="categoryImage">Enter category image - optional</label>
            <input id="categoryImage" type="file" onChange={imageLoad}/>
            <button type="submit" value="Submit" className="submitButton" onClick={submitNewCategory}><SendIcon/></button>
        </form>
    );
};

export default CategoryAddUpdate;