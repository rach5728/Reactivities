import React, { FormEvent, useContext, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore'
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';

interface IProps {
    activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({
    activity: initializeFomState
}) => {
    const activityStore = useContext(ActivityStore);
    const { createActivity, editActivity, submitting, cancelFormOpen } = activityStore;
    const initializeForm = () => {
        if (initializeFomState) {
            return initializeFomState;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            };
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;//destructure
        setActivity({ ...activity, [name]: value })
    }

    const handleSubmit = () => {
        //console.log(activity);
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input placeholder='Title'
                    onChange={handleInputChange}
                    name='title'
                    value={activity.title}
                />
                <Form.TextArea
                    onChange={handleInputChange}
                    name='description'
                    rows={2}
                    placeholder='Description'
                    value={activity.description} />
                <Form.Input
                    onChange={handleInputChange}
                    name='category'
                    placeholder='Category'
                    value={activity.category} />
                <Form.Input
                    onChange={handleInputChange}
                    name='date'
                    type='datetime-local'
                    placeholder='Date'
                    value={activity.date} />
                <Form.Input
                    onChange={handleInputChange}
                    name='city'
                    placeholder='City'
                    value={activity.city} />
                <Form.Input
                    onChange={handleInputChange}
                    name='venue'
                    placeholder='Venue'
                    value={activity.venue} />
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button onClick={cancelFormOpen} floated='right' type='button' content='Cancel' />

            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);