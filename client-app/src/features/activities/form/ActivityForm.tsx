import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate'

const validate = combineValidators({
    title: isRequired({ message: 'The event title is required' }),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({ message: 'Description needs to be atleast 5 characters' })
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface DetailParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const {
        createActivity
        , editActivity
        , submitting
        , loadActivity
    } = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id).then(
                (activity) => setActivity(new ActivityFormValues(activity))
            ).finally(() => setLoading(false));
        }
    }, [
        loadActivity,
        match.params.id
    ]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = new Date(values.date.getFullYear(), values.date.getMonth(), values.date.getDate(), values.time.getHours(), values.time.getMinutes(), values.time.getSeconds());
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;

        //console.log(activity);
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

    return (
        <Grid>
            <Grid.Column>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit} loading={Loading} >
                                <Field
                                    placeholder='Title'
                                    name='title'
                                    value={activity.title}
                                    component={TextInput}
                                />
                                <Field
                                    name='description'
                                    rows={3}
                                    placeholder='Description'
                                    value={activity.description}
                                    component={TextAreaInput} />
                                <Field
                                    name='category'
                                    placeholder='Category'
                                    value={activity.category}
                                    component={SelectInput}
                                    options={category} />
                                <Form.Group widths='equal'>
                                    <Field
                                        name='date'
                                        placeholder='Date'
                                        date={true}
                                        value={activity.date}
                                        component={DateInput} />
                                    <Field
                                        name='time'
                                        placeholder='Time'
                                        time={true}
                                        value={activity.time}
                                        component={DateInput} />
                                </Form.Group>

                                <Field
                                    name='city'
                                    placeholder='City'
                                    value={activity.city}
                                    component={TextInput} />
                                <Field
                                    name='venue'
                                    placeholder='Venue'
                                    value={activity.venue}
                                    component={TextInput} />

                                <Button loading={submitting}
                                    floated='right'
                                    positive type='submit'
                                    content='Submit'
                                    disabled={Loading || invalid || pristine} />
                                <Button
                                    onClick={activity.id
                                        ? () => history.push(`/activities/${activity.id}`)
                                        : () => history.push('/activities')
                                    }
                                    floated='right'
                                    type='button'
                                    content='Cancel'
                                    disabled={Loading} />

                            </Form>
                        )}
                    />

                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityForm);