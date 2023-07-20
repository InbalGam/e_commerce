import { useEffect, useState } from "react";


function CategoryAddUpdate(props) {
    const [categoryName, setCategoryName] = useState('');

    function handleCategoryNameChange(e) {
        setCategoryName(e.target.value);
    };

    return (
        <form>
            <input id='categoryName' type='text' name='categoryName' value={categoryName} placeholder={'Enter category name'} onChange={handleCategoryNameChange} />
            <label htmlFor="categoryImage">Enter category image - optional</label>
        </form>
    );
};

export default CategoryAddUpdate;