function Category(props) {
    // add edit and delete for admins only
    return (
        <li key={props.ind}>
            <p>{props.el.categoryName}</p>
        </li>
    );
};

export default Category;