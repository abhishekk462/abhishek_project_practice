import React, { Component } from 'react'
import axios from 'axios'

import './App.css';
import SearchBox from './Components/SearchBox/SearchBox'
import SearchBar from './Components/SearchBar';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gallery: [],
      currentQuery: '',
      searchedQuery: '',
      page: 1,
      selectedImage: {
        description: '',
        src: '',
        username: '',
        page: '',
      },
    }
  }
  // i have written api
  ROOT = `https://api.unsplash.com/`
  KEY ="?client_id=IT1eWqx8QiSB2KBjviApk8Q6Z18MAaPY0eUCme-i6Ho"
  SIZE ="&w=100&h=100"
  PERPAGE = `&per_page=9`
// i have call unsplash api inside fetchInitialImages using Axios third party library 
  fetchInitialImages = () => {
    this.setState({ searchedQuery: 'List of Images'})
    axios.get(`${this.ROOT}photos${this.KEY}${this.SIZE}${this.PERPAGE}`)
      .then(res => {
        let results = res.data
        console.log('results = ', results)
        this.setState(() => {
          return { gallery: [...results] }
        })
      })
      .catch(error => console.log(error))
  }
  //after click on any images thats model popup
  launchModal = (index) => {
    this.setState((prevState) => {
      return { 
        selectedImage: {
          description: prevState.gallery[index].description,
          src: prevState.gallery[index].urls.regular,
          username: prevState.gallery[index].user.username,
          page: prevState.gallery[index].user.links.html,
        }
      }
    })
  }
  //click on load more button method
  loadMore = () => {
    this.setState((prevState) => {
      return {page: prevState.page + 1}
    }, () => {
      if (this.state.searchedQuery === 'List of Images') { //i have writen search query
        axios.get(`${this.ROOT}photos${this.KEY}${this.PERPAGE}&page=${this.state.page}`)
          .then(res => {
            let results = res.data
            console.log('results = ', results)
            this.setState((prevState) => {
              return { gallery: [...prevState.gallery, ...results] }
            })
          })
          .catch(error => console.log(error))
      } else {
        axios.get(`${this.ROOT}search/photos${this.KEY}&query=${this.state.currentQuery}${this.PERPAGE}&page=${this.state.page}`)
          .then(res => {
            let results = res.data.results
            console.log('results = ', results)
            this.setState((prevState) => {
              return { gallery: [...prevState.gallery, ...results] }
            })
          })
          .catch(error => console.log(error))
      }
    })
  }

  componentDidMount() {
    this.fetchInitialImages()
  }

  // currentItem
  // handleChangeInitialized = false
  // isCurrentItemInitialized = true
  handleChange = (e) => {
    // this.handleChangeInitialized = true
    // this.isCurrentItemInitialized = true
    // this.currentItem = this.state.currentQuery
    this.setState({
      currentQuery: e.target.value
    })
  }
  // searchbox method
  handleSubmit = (e) => {
    e.preventDefault()
    this.setState((prevState) => {
      return {searchedQuery: prevState.currentQuery}
    })
    axios.get(`${this.ROOT}search/photos${this.KEY}&query=${this.state.currentQuery}${this.PERPAGE}`)
      .then(res => {
        let results = res.data.results
        console.log('results = ', results)
        this.setState({
          gallery: [...results]
        })
      })
      .catch(error => console.log(error))
  }


  render() {
    return (
      <div className="App">
      <SearchBar fetchInitialImages={this.fetchInitialImages} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
        <div className="container">
          <h1 className="text-center">{this.state.searchedQuery}</h1>
          <SearchBox gallery={this.state.gallery} loadMore={this.loadMore} launchModal={this.launchModal} selectedImage={this.state.selectedImage} />
        </div>
      </div>
    );
  }
}

export default App
