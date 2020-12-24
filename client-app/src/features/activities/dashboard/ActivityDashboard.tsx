import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityStore from '../../../app/stores/activityStore'
import LoadingComponent from '../../../app/layout/LoadingComponent';

const ActivityDashboard: React.FC = () => {
    const activityStore = useContext(ActivityStore);

    //react hooks
    //lifecycle- useeffect>get>set>useeffect repeat (if [] is not used as second param)
    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);//[] ensures our useEffect runs one time only. otherwise Everytime the component runs useEffect is called.

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />


    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);