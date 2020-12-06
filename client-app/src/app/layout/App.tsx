import React, { Component } from 'react';
import { Icon, Header, List } from 'semantic-ui-react'
import axios from 'axios';
import { IActivity } from '../../models/activity';

interface IState {
    activities: IActivity[]//activities type of IActivity
}
//p- property, s-state (Mouseover component)
class App extends Component<{}, IState> {
    readonly state: IState = {  //state type of IState
        activities: []
    };

    componentDidMount() {
        axios.get <IActivity[]>('https://localhost:44356/api/activities').then(response => {            
            this.setState({
                activities: response.data
            });
        });
    }

    render() {
        return (
            <div>
                <Header as='h2'>
                    <Icon name='users' />
                    <Header.Content>Reactivities</Header.Content>
                </Header>
                <List>
                    {this.state.activities.map((activity: IActivity) => (
                        <List.Item key={activity.id}>{activity.title}</List.Item>
                    ))}
                </List>
            </div>
        );
    }
}

export default App;
