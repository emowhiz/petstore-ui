class PetRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.pet.name}</td>
                <td>{this.props.pet.category.name}</td>
            </tr>
        );
    }
}

class PetTable extends React.Component {
    render() {
        var rows = [];

        this.props.pets.forEach(function (pet) {
            if (pet.name.indexOf(this.props.filterText) === -1) {
                return;
            }
            rows.push(<PetRow pet={pet} key={pet.name}/>);

        }.bind(this));
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.onUserInput(
            this.refs.filterTextInput.value
        );
    }

    render() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                    />
            </form>
        );
    }
}

class FilterablePetTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.loadPetsFromServer = this.loadPetsFromServer.bind(this)
        this.loadPetsFromServer();
        setInterval(this.loadPetsFromServer, this.props.pollInterval);
        this.state = {
            filterText: '',
            data: []
        };
    }

    loadPetsFromServer() {
        $.ajax({
            url: this.props.url + "findByStatus/available",
            dataType: 'json',
            cache: false,
            crossDomain: true,
            success: function (data) {
                //alert(data)
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    handleUserInput(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    onUserInput={this.handleUserInput}
                    />
                <PetTable
                    pets={this.state.data}
                    filterText={this.state.filterText}
                    />
            </div>
        );
    }
}


ReactDOM.render(
    <FilterablePetTable url="http://localhost:8080/pet/" pollInterval={2000}/>,
    document.getElementById('content')
);

