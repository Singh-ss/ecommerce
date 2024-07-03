import React, { Fragment, useEffect, useState } from 'react';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, clearErrors } from '../../actions/productAction';
import './Products.css'
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { Typography, Slider } from "@material-ui/core";
import { useAlert } from "react-alert";
import MetaData from '../layout/MetaData';

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "Smartphones"
]

const Products = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 200000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const { keyword } = useParams();

    const alert = useAlert();

    const dispatch = useDispatch();
    const { products, loading, error, resultsPerPage, filteredProductsCount } = useSelector(state => state.products);

    // the below function recieves page number as argument
    const setCurrentPageNo = newPageNumber => {
        setCurrentPage(newPageNumber)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    let count = filteredProductsCount;

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, keyword, currentPage, price, category, ratings, alert, error])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title='Products -- Ecommerce' />
                    <h2 className='productsHeading'>Products</h2>
                    <div className="products">
                        {products && products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay='auto'
                            aria-labelledby='range-slider'
                            min={0}
                            max={200000}
                        />

                        <Typography>Categories</Typography>
                        <ul className='categoryBox'>
                            {categories.map((categoryItem, i) => (
                                <li
                                    key={categoryItem}
                                    onClick={() => setCategory(categoryItem)}
                                    className='category-link'
                                >
                                    {categoryItem}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component='legend'>Ratings above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRatings) => setRatings(newRatings)}
                                aria-labelledby='continuous-slider'
                                valueLabelDisplay='auto'
                                min={0}
                                max={5}
                            />
                        </fieldset>

                    </div>

                    {resultsPerPage < count && (
                        <div className="paginationBox">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultsPerPage}
                                totalItemsCount={count}
                                // the below property function recieves page number as argument
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass='page-item'
                                linkClass='page-link'
                                activeClass='pageItemActive'
                                activeLinkClass='pageLinkActive'
                            />
                        </div>
                    )}
                </Fragment>}
        </Fragment>
    );
};

export default Products;