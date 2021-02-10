import React, { useEffect, useContext, useReducer } from 'react'
import reducer from '../reducers/filter_reducer'
import {
  //lOAD_PRODUCTS action is used in order to be able 
  // to use useProductsContext hook to pass products 
  // from product_context into filter_context
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'
import { useProductsContext } from './products_context'

const initialState = {
  //array of products consistently changing
  filtered_products: [],
  //array of all products
  all_products: [],
  grid_view: true,
  sort: 'price-lowest',
  filters: {
    text: '',
    company: 'all',
    category: 'all',
    color: 'all',
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  }
}

const FilterContext = React.createContext()

export const FilterProvider = ({ children }) => {
  const { products } = useProductsContext();
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: LOAD_PRODUCTS, payload: products })
  }, [products])

  useEffect(() => {
    dispatch({ type: FILTER_PRODUCTS })
    dispatch({ type: SORT_PRODUCTS })
    //every time that the component mounts/ renders, 
    //we want to trigger states properties sort and filters
    // so we add them to the dependency array
  }, [products, state.sort, state.filters])



  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW })
  }

  const setListView = () => {
    dispatch({ type: SET_LISTVIEW })
  }

  const updateSelectSort = (e) => {
    const value = e.target.value
    dispatch({ type: UPDATE_SORT, payload: value })
  }

  const updateFilters = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    //because we cannot access the value property of a button
    //element by using e.target.value
    if (name === 'category') {
      value = e.target.textContent;
    }

    //because we cannot access the value property of a button
    //element by using e.target.value
    if (name === 'color') {
      value = e.target.dataset.color;
    }

    //because range inputs return strings, not numbers
    if (name === 'price') {
      value = Number(value);
    }

    if (name === 'shipping') {
      value = e.target.checked;
    }
    dispatch({ type: UPDATE_FILTERS, payload: { name, value } })
  }


  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }

  return (
    <FilterContext.Provider value={{ ...state, setGridView, setListView, updateSelectSort, updateFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  )
}
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext)
}
