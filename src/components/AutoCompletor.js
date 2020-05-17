import React from "react";
import * as Constants from "../common/constants";
import * as _ from "lodash";
import icon from "../cross.png";
import AutoCompletorRow from "./AutoCompletorRow";

export default class AutoCompletor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.counter = -1;
    this.state = {
      searchTerm: "",
      isLoading: false,
      moviesList: [],
      keyHover: undefined,
      movieSelected: "",
      showResults: true,
    };
    this.onInputValueChange = this.onInputValueChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onCrossClicked = this.onCrossClicked.bind(this);
    this.onMovieResultClicked = this.onMovieResultClicked.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
      window.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount(){
      window.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick(e){
      if(this.moviesResultRef && !this.moviesResultRef.contains(e.target)){
        this.setState({
            showResults: false,
          });
      }
  }

  onInputValueChange(e) {
    this.setState({
      searchTerm: e.target.value,
      showResults: true,
    });

    if (this.state.searchTerm.length >= 3) {
      _.debounce(this.fetchData, 200)();
    }
  }

  onKeyPressed(e) {
    const moviesResultList = this.moviesResultRef; //ref
    var data;
        if (e.keyCode === 38) {
            //Up arrow
            if(this.counter >0){
                data = moviesResultList.children[--this.counter];
                this.setState({
                  keyHover: data.getAttribute("id"),
                });
            }
           
          } else if (e.keyCode === 40) {
            // Down arrow
            if(this.counter < this.state.moviesList.length-1){
                data = moviesResultList.children[++this.counter];
                this.setState({
                  keyHover: data.getAttribute("id"),
                });
            }
           
          } else if (e.keyCode === 13) {
            //Enter key
            if(this.state.moviesList.length){
            data = moviesResultList.children[this.counter];
            this.setState({
              movieSelected: data.innerHTML,
              showResults: false,
            });
          }
        }
  }

  onCrossClicked() {
    this.setState({
      searchTerm: "",
      moviesList: [],
    });
  }

  fetchData() {
    var url = Constants.MOVIES_SEARCH_URL + this.state.searchTerm;

    this.setState({
      isLoading: true,
    });
    fetch(url)
      .then((res) => res.json())
      .then((resp) => {
          if(resp.Response === "True"){
            this.counter = -1;
            this.setState({
              moviesList: resp.Search,
              isLoading: false,
            });
          }else{
            this.counter = -1;
            this.setState({
              moviesList: [],
              isLoading: false,
            });
          }
       
      })
      .catch((err) => {});
  }

  onMovieResultClicked(e) {
    this.setState({
      movieSelected: e.target.innerHTML,
      showResults: false,
    });
  }

  render() {
    return (
      <div className="container">
        <div id="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search Movies"
              value={this.state.searchTerm}
              onKeyDown={this.onKeyPressed}
              onChange={this.onInputValueChange}
            />

            {this.state.searchTerm.length > 0 && (
              <img
                width="30px"
                height="30px"
                src={icon}
                alt="cross-icon"
                onClick={this.onCrossClicked}
              />
            )}
          </div>
          {this.state.searchTerm.length > 0 && <div className="divider"></div>}
          {this.state.showResults && (
            <div
              className="search-result-container"
              ref={(node) => (this.moviesResultRef = node)}
              onClick={this.onMovieResultClicked}
            >
              {this.state.moviesList && this.state.moviesList.length > 0
                ? this.state.moviesList.map((val) => (
                    <AutoCompletorRow
                      key={val.imdbID}
                      id={val.imdbID}
                      movie={val}
                      hoveredId={this.state.keyHover}
                    />
                  ))
                : this.state.searchTerm.length > 0 &&
                  !this.state.isLoading && (
                    <div className="search-result-row">NO MOVIES FOUND </div>
                  )}
            </div>
          )}
        </div>

        <h2>
          {this.state.movieSelected.length > 0 && this.state.movieSelected}
        </h2>
      </div>
    );
  }
}
