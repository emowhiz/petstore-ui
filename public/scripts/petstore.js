class PetRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this)
        this.updateCategory = this.updateCategory.bind(this)
    }

    handleDelete(e) {
        $.ajax({
            url: "http://localhost:8080/pet/" + this.props.pet.id,
            type: 'DELETE',
            dataType: 'text',
            cache: false,
            crossDomain: true,
            success: function (data) {
                alert(data)
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    updateCategory(cat_id, category) {
        var pet = {
            "id": this.props.pet.id,
            "name": this.props.pet.name,
            "tags": this.props.pet.tags,
            "status": this.props.pet.status,
            "photoUrls": this.props.pet.photoUrls,
            "category": {
                "id": cat_id,
                "name": category
            }
        };
        console.log(JSON.stringify(pet))
        $.ajax({
            url: "http://localhost:8080/pet",
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(pet),
            cache: false,
            crossDomain: true,
            success: function (data) {
                console.log("category changed" + JSON.stringify(data))
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        return (
            <tr>
                <td>{this.props.pet.name}</td>
                <td>{this.props.pet.category.name}</td>
                <td><input type="button" onClick={this.updateCategory.bind(this,1,"category1")} value="category1"/></td>
                <td><input type="button" onClick={this.updateCategory.bind(this,2,"category2")} value="category2"/></td>
                <td><input type="button" onClick={this.updateCategory.bind(this,3,"category3")} value="category3"/></td>
                <td><input type="button" onClick={this.handleDelete} value="delete"/></td>

            </tr>
        );
    }
}

class PetTable extends React.Component {
    render() {
        var rows = [];
        console.log(this.props.pets.length)
        var addPet = 0
        this.props.pets.forEach(function (pet) {
            if (pet.name.indexOf(this.props.filterText) === -1) {
                return;
            }
            rows.push(<PetRow pet={pet} key={pet.id}/>);
            addPet++
        }.bind(this));
        if (addPet>0) {
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
        } else {
            return (
                <PetForm stext={this.props.filterText}/>
            );
        }
    }
}
class PetForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();

        var id = this.refs.id.value.trim();
        var name = this.refs.name.value.trim();

        alert(id+name)

        if (!name || !id) {
            return;
        }
        var pet = {
            "id": Number(id),
            "name": name,
            "tags": [
                {
                    "id": 1,
                    "name": "xxx"
                }
            ],
            "status": "available",
            "photoUrls": [
                "xxx"
            ],
            "category": {
                "id": 0,
                "name": "default category"
            }
        };
        console.log(JSON.stringify(pet))
        $.ajax({
            url: "http://localhost:8080/pet",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(pet),
            cache: false,
            crossDomain: true,
            success: function (data) {
                console.log("Pet added" + JSON.stringify(data))
                this.refs.id.value = '';
                this.refs.name.value = '';
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })


    }

    render() {
        return (
            <form className="petForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="ID for the pet" ref="id"/> <br/>
                <input type="text" value={this.props.stext} ref="name"/> <br/>
                <input type="submit" value="Add Pet"/>
            </form>
        );
    }
}
;

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
                <b>Search available pets by name</b> <br/>
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

