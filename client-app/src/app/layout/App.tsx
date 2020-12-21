//import React, { Component } from 'react';
import React, { useEffect, Fragment } from 'react';
import { Container } from 'semantic-ui-react'
import NavBar from '../../features/nav/navBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useContext } from 'react';
import ActivityStore from '../stores/activityStore'
import { observer } from 'mobx-react-lite';


const App = () => {
    const activityStore = useContext(ActivityStore);

    //react hooks
    //lifecycle- useeffect>get>set>useeffect repeat (if [] is not used as second param)
    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);//[] ensures our useEffect runs one time only. otherwise Everytime the component runs useEffect is called.

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

    //render() {
    return (
        //<div>
        <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard />
            </Container>
        </Fragment>
        //</div>
    )
    //}
}

export default observer(App);
